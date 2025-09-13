import React, { useEffect, useState } from "react";
import { ScrollArea } from "../../Components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";
import { Calendar, CalendarXIcon, FileXIcon, StethoscopeIcon, TableIcon, Video } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearAppointmentError,
  getPrescriptions,
  updateAppointment,
} from "../../../src/Store/appointmentSlice";
import PatientTableContent from "./PatientTableContent";
import { showErrorToast } from "../../Components/toastUtils";
import VideoConsultation from "./VideoConsultation";
import GlobalSheet from "../../Components/Common/GlobalSheet";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import PatientColumn from "../../Components/Prescription/PatientColumn";
import {
  allowedTransitions,
  initialStatuses,
  statusColors,
} from "../../util/patientUtil";
import toast from "react-hot-toast";
import Loader from "../../Components/Common/Loader";

function PatientDetails() {
  const [channelName, setChannelName] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [status, setStatus] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState(""); // Track current patient ID
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const dispatch = useDispatch();

  const { prescriptionData, isLoading, error } = useSelector(
    (state) => state.appointment
  );
  const { profileData } = useSelector((state) => state.profile);
  console.log(filteredData)
  useEffect(() => {
    getAppointmentData();
  }, [dispatch]);

  function getAppointmentData() {
    dispatch(getPrescriptions({ practitionerId: profileData?._id }));
  }

  // Function to automatically check out patients whose endDateTime has passed
  const checkAndAutoCheckout = async () => {
    const currentTime = new Date();
    
    // Find patients who are checked in but past their endDateTime
    const patientsToCheckout = prescriptionData.filter((patient) => {
      const { bookingStatus, endDateTime } = patient;
      const appointmentEndTime = new Date(endDateTime);
      
      // Check if patient is checked in but not checked out/closed and past endDateTime
      return (
        bookingStatus.checkIn && 
        !bookingStatus.checkOut && 
        !bookingStatus.closed && 
        currentTime > appointmentEndTime
      );
    });

    // Auto checkout each patient
    for (const patient of patientsToCheckout) {
      try {
        const updatedStatus = {
          checkOut: new Date(),
        };
        const body = { bookingStatus: updatedStatus };
        
        await dispatch(updateAppointment({ _id: patient._id, body })).unwrap();
        console.log(`Auto checked out patient: ${patient._id} - appointment ended at ${patient.endDateTime}`);
      } catch (error) {
        console.error(`Failed to auto checkout patient ${patient._id}:`, error);
      }
    }

    // Refresh data if any patients were checked out
    if (patientsToCheckout.length > 0) {
      getAppointmentData();
    }
  };

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

  // Check for auto checkout when prescriptionData changes
  useEffect(() => {
    if (prescriptionData.length > 0) {
      checkAndAutoCheckout();
    }
  }, [prescriptionData]);

  // Set up interval to check for auto checkout every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (prescriptionData.length > 0) {
        checkAndAutoCheckout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [prescriptionData]);

  const onTaskDrop = async (event, newStatus) => {
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

      if (currentStatusKey === "Scheduled" && newStatus === "Checked In") {
  const appointmentTime = new Date(patient.startDateTime); // assuming startDateTime exists
  const currentTime = new Date();
  const diffInMinutes = (appointmentTime - currentTime) / (1000 * 60); // difference in minutes

  if (diffInMinutes > 5) {
    showErrorToast(
      `You can only check in this patient within 5 minutes of the appointment time.`
    );
    return; // prevent drag-drop
  }
}



      if (!allowedTransitions[currentStatusKey]?.includes(newStatus)) {
        return;
      }

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
        [updatedStatusKey]: new Date(),
      };

      const body = { bookingStatus: updatedStatus };
      try {
        await dispatch(updateAppointment({ _id: patientId, body })).unwrap();
        toast.success("Apponinment Status Successfully Changed");
        getAppointmentData();
      } catch (error) {
        toast.error(error);
      }
    } else {
      console.error("Appointment not found in prescriptionData");
    }
  };

  // Function to update patient status to Checked Out
  const updatePatientToCheckedOut = async (patientId) => {
    if (!patientId) {
      console.log("No patient ID provided for checkout");
      return;
    }
    
    console.log("Updating patient to checked out:", patientId);
    
    // Find the current patient to check their current status
    const patient = prescriptionData.find((item) => item._id === patientId);
    if (!patient) {
      console.error("Patient not found in prescriptionData");
      return;
    }

    // Follow the same pattern as onTaskDrop for "Checked Out"
    const updatedStatus = {
      checkOut: new Date(),
    };

    const body = { bookingStatus: updatedStatus };
    try {
      await dispatch(updateAppointment({ _id: patientId, body })).unwrap();
      toast.success("Patient status updated to Checked Out");
      getAppointmentData();
      console.log("Patient successfully updated to checked out");
    } catch (error) {
      console.error("Error updating patient status:", error);
      toast.error(error);
    }
  };

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    setIsFormSheetOpen(true);
  };

  const closeSheet = () => {
    setIsFormSheetOpen(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => {
        dispatch(clearAppointmentError());
      }, 2000);
    }
  }, [error]);

  function checkOnlineAppointment (appointments){
    return appointments.filter((item) => item?.visitType ==="Online")
  }

  return (
    <div className={`h-full w-full   ${channelName?"p-0":"p-2"} relative`}>
      {isLoading ? (
        <Loader />
      ) : (
        checkOnlineAppointment(prescriptionData).length >0 ?
        <>
          <div>
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
                        <h2 className="text-sm font-semibold">
                          {status.display}
                        </h2>
                      </div>
                      <ScrollArea className={`h-full`}>
                        <div
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => onTaskDrop(event, status.display)}
                          className="p-2 bg-gray-50 rounded-lg shadow-inner h-[570px]"
                        >
                          {
                            filteredData[status.display]?.map((patient) => (
                           patient.visitType === "Online" && <PatientColumn
                              patient={patient}
                              setChannelName={setChannelName}
                              setStatus={setStatus}
                              setCurrentPatientId={setCurrentPatientId} // Pass the setter
                            />
                          ))
                          }
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="Table">
                <PatientTableContent
                  patients={prescriptionData}
                  setChannelName={setChannelName}
                  setStatus={setStatus}
                  setCurrentPatientId={setCurrentPatientId} // Pass the setter
                />
              </TabsContent>
            </Tabs>
          </div>

          {channelName && (
            <VideoConsultation
              channelName={channelName}
              setChannelName={setChannelName}
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              currentPatientId={currentPatientId}
              updatePatientToCheckedOut={updatePatientToCheckedOut} 
            />
          )}
          <GlobalSheet
            isDialogOpen={isSheetOpen}
            setIsDialogOpen={setIsSheetOpen}
            label={`Patient Status: ${status || "Not Available"}`}
            triggerText=""
            buttonClassName="hidden"
          >
            <div>
              {status === "Checked In" && (
                <ScrollArea className={`h-screen`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto px-5">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg shadow-lg overflow-hidden bg-gray-800"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${category.backgroundImage})`,
                          }}
                        ></div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 to-[#3B82F6]/70 rounded-md"></div>

                        <div className="relative p-4 text-white z-10 flex flex-col justify-between h-full">
                          <div className="flex items-center space-x-2">
                            <div>{category.icon}</div>
                            <h3 className="text-sm font-semibold ">
                              {" "}
                              {category.name}
                            </h3>
                          </div>
                          <p className="text-xs mt-2">{category.description}</p>
                          <div className="flex justify-between">
                            <div></div>
                            <button
                              onClick={() => handleButtonClick(category)}
                              className="mt-1 bg-slate-300 text-blue-600 rounded-full shadow-lg flex items-center justify-center w-7 h-7"
                              aria-label={`Fill details for ${category.name}`}
                            >
                              &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedCategory && (
                      <FillDetailsSheet
                        isDialogOpen={isFormSheetOpen}
                        setIsDialogOpen={setIsFormSheetOpen}
                        selectedCategory={selectedCategory}
                        closeSheet={closeSheet}
                      />
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </GlobalSheet>
        </>: 
        <div className="min-h-full  flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-96 w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-[#e6f4f1] p-4">
                <Calendar className="w-8 h-8 text-[#64c6b0]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                No Appointments Found
              </h2>
              <p className="text-gray-600">
                There are currently no appointments scheduled. Check back later or create a new appointment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;