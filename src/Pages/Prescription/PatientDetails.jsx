import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../Components/ui/avatar";
import { ScrollArea } from "../../Components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";
import { StethoscopeIcon, TableIcon, Video } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPrescriptions,
  updateAppointment,
} from "../../../src/Store/appointmentSlice";
import { format, parseISO } from "date-fns";
import PatientTableContent from "./PatientTableContent";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../Components/ui/badge";
import { showErrorToast } from "../../Components/toastUtils";
import { CustomTooltip } from "../../Components/Common/CustomTooltip";

const initialStatuses = [
  { display: "Scheduled", key: "scheduled" },
  { display: "Checked In", key: "checkedIn" },
  { display: "Checked Out", key: "checkedOut" },
  { display: "Closed", key: "closed" },
];
const formatTime = (dateString) => {
  const utcDate = parseISO(dateString);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );
  return format(localDate, "hh:mm a");
};
const formatDateRange = (startDateTime, endDateTime) => {
  const startDate = new Date(startDateTime);
  const formattedDate = format(startDate, "MMMM dd, yyyy");
  const startTime = formatTime(startDateTime);
  const endTime = formatTime(endDateTime);
  return {
    date: formattedDate,
    timeRange: `${startTime}–${endTime}`,
  };
};

function PatientDetails() {
  const navigate = useNavigate();
  const { profileData } = useSelector((state) => state.profile);
  const { prescriptionData } = useSelector((state) => state.appointment);
  const dispatch = useDispatch();

  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    dispatch(getPrescriptions({ practitionerId: profileData?._id }));
  }, [dispatch]);

  useEffect(() => {
    const filtered = {
      Scheduled: [],
      "Checked In": [],
      "Checked Out": [],
      Closed: [],
    };

    prescriptionData.forEach((patient) => {
      const { bookingStatus } = patient;

      if (bookingStatus.closed) {
        filtered.Closed.push(patient);
      } else if (bookingStatus.checkOut) {
        filtered["Checked Out"].push(patient);
      } else if (bookingStatus.checkIn) {
        filtered["Checked In"].push(patient);
      } else if (bookingStatus.booked) {
        filtered.Scheduled.push(patient);
      }
    });

    setFilteredData(filtered);
  }, [prescriptionData]);

  console.log(prescriptionData);

  const handleTaskClick = (patient) => {
    const { bookingStatus } = patient;
  
    let status = "Scheduled"; // Default status
  
    // Determine the status based on the bookingStatus flags
    if (bookingStatus.booked && bookingStatus.checkIn && bookingStatus.checkOut && bookingStatus.closed) {
      status = "Closed";
    } else if (bookingStatus.booked && bookingStatus.checkIn && bookingStatus.checkOut) {
      status = "Checked Out";
    } else if (bookingStatus.booked && bookingStatus.checkIn) {
      status = "Checked In";
    } else if (bookingStatus.booked) {
      status = "Scheduled";
    }
    navigate("/fillDetails", { state: { status } });
  };
  
  const statusColors = {
    Scheduled: "bg-purple-100 text-purple-800",
    "Checked In": "bg-green-100 text-green-800",
    "Checked Out": "bg-yellow-100 text-yellow-800",
    Closed: "bg-red-100 text-red-800",
  };

  const onTaskDragStart = (event, patientId) => {
    event.dataTransfer.setData("text/plain", patientId.toString());
  };

  const allowedTransitions = {
    Scheduled: ["Checked In"],
    "Checked In": ["Checked Out"],
    "Checked Out": ["Closed"],
    Closed: [],
  };

  const onTaskDrop = (event, newStatus) => {
    event.preventDefault();
    const patientId = event.dataTransfer.getData("text/plain");
    const patient = prescriptionData.find((item) => item._id === patientId);

    if (patient) {
      const { bookingStatus } = patient;
      let currentStatusKey;
      if (bookingStatus.closed) {
        currentStatusKey = "Closed";
      } else if (bookingStatus.checkOut) {
        currentStatusKey = "Checked Out";
      } else if (bookingStatus.checkIn) {
        currentStatusKey = "Checked In";
      } else if (bookingStatus.booked) {
        currentStatusKey = "Scheduled";
      }

      if (!allowedTransitions[currentStatusKey]?.includes(newStatus)) {
        showErrorToast(
          `Can't change status from ${currentStatusKey} to ${newStatus} for Swetarani Patel.`
        );
        return;
      }

      // Validation: Check for duplicate IDs in the target section
      const isDuplicate = filteredData[newStatus]?.some(
        (p) => p._id === patientId
      );

      if (isDuplicate) {
        showErrorToast(
          `Patient with ID ${patientId} already exists in the ${newStatus} section.`
        );
        return;
      }

      let updatedStatusKey;
      if (newStatus === "Scheduled") {
        updatedStatusKey = "booked";
      } else if (newStatus === "Checked In") {
        updatedStatusKey = "checkIn";
      } else if (newStatus === "Checked Out") {
        updatedStatusKey = "checkOut";
      } else if (newStatus === "Closed") {
        updatedStatusKey = "closed";
      }

      const updatedStatus = {
        ...bookingStatus,
        [updatedStatusKey]: new Date(),
      };

      const body = { bookingStatus: updatedStatus };
      dispatch(updateAppointment({ _id: patientId, body }));

      setFilteredData((prev) => {
        const updatedData = { ...prev };
        // Remove from current section
        updatedData[currentStatusKey] = updatedData[currentStatusKey].filter(
          (p) => p._id !== patientId
        );
        // Add to new section
        updatedData[newStatus] = [...(updatedData[newStatus] || []), patient];

        return updatedData;
      });
    } else {
      console.error("Patient not found in prescriptionData");
    }
  };

  return (
    <div className={`h-full overflow-y-auto custom-scrollbar p-1`}>
      <Tabs defaultValue="Patient Details">
        <TabsList>
          <TabsTrigger value="Patient Details">
            <StethoscopeIcon className="w-5 h-5" />
            <span className="ml-2">Patient Details</span>
          </TabsTrigger>
          <TabsTrigger value="Table">
            <TableIcon className="w-5 h-5" />
            <span className="ml-2">Table</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Patient Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
            {initialStatuses.map((status) => (
              <div
                key={status.display}
                className="bg-white p-5 pb-20 rounded-xl shadow-lg border border-gray-200 h-[570px] overflow-hidden custom-scrollbar"
              >
                <div
                  className={`flex justify-between items-center mb-4 p-2 rounded-lg ${
                    statusColors[status.display]
                  }`}
                >
                  <h2 className="text-sm font-semibold">{status.display}</h2>
                </div>
                <ScrollArea className={`h-full`}>
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onTaskDrop(event, status.display)}
                    className="p-2 bg-gray-50 rounded-lg shadow-inner h-[570px]"
                  >
                    {filteredData[status.display]?.map((patient) => {
                      const { date, timeRange } = formatDateRange(
                        patient.startDateTime,
                        patient.endDateTime
                      );

                      return (
                        <div
                          key={patient._id}
                          className="bg-white p-4 mb-1 rounded-lg cursor-pointer shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
                          draggable
                          onDragStart={(event) =>
                            onTaskDragStart(event, patient._id)
                          }
                          onClick={() => handleTaskClick(patient)}
                        >
                          <div className="flex items-center space-x-4 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={patient.profileImage} />
                              <AvatarFallback>PV</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <h3 className="text-sm font-semibold text-gray-600">
                                {`${patient.practitionerData.firstName} ${patient.practitionerData.lastName}`}
                              </h3>
                              <p className="text-xs text-gray-500">34Y | F</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">{date}</p>{" "}
                            <p className="text-xs text-gray-400">{timeRange}</p>{" "}
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm">
                            <Badge variant="forestLight">Appointment</Badge>
                            <CustomTooltip content={`Video call`}>
                            <Video
                              className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                              size={20}
                            />
                            </CustomTooltip>
                            
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Table">
          <PatientTableContent patients={prescriptionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PatientDetails;
