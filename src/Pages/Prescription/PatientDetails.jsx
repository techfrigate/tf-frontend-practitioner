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
import PrescriptionComposer from "../Rx/PrescriptionComposer";
import PatientColumn from "../../Components/Prescription/PatientColumn";
import { useNavigate } from "react-router-dom";
import { isToday as isTodayDate, startOfToday } from "date-fns";
import { ArrowRight, MonitorSmartphone } from "lucide-react";
import { wallClock } from "../../util/clinicApi";
import {
  allowedTransitions,
  initialStatuses,
  statusColors,
} from "../../util/patientUtil";
import toast from "react-hot-toast";
import Loader from "../../Components/Common/Loader";

const COLUMN_DOTS = { Scheduled: "bg-brand-500", "Checked In": "bg-amber-400", "Checked Out": "bg-care-500", Closed: "bg-slate-400" };
const COLUMN_EMPTY = {
  Scheduled: "No one waiting",
  "Checked In": "Check a patient in to start their call",
  "Checked Out": "Finished calls appear here",
  Closed: "Closed visits appear here",
};

function PatientDetails() {
  const [channelName, setChannelName] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [status, setStatus] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState(""); // Track current patient ID
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scope, setScope] = useState("today");
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { prescriptionData, isLoading, error } = useSelector(
    (state) => state.appointment
  );
  const { profileData } = useSelector((state) => state.profile);
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
      const appointmentEndTime = wallClock(endDateTime);
      
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

    const today = startOfToday();
    prescriptionData
      .filter((patient) => patient.visitType === "Online")
      .filter((patient) => {
        const start = wallClock(patient.startDateTime);
        if (scope === "today") return isTodayDate(start);
        if (scope === "upcoming") return start >= today;
        return true;
      })
      .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime))
      .forEach((patient) => {
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
  }, [prescriptionData, scope]);

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

  const STATUS_KEYS = { "Checked In": "checkIn", "Checked Out": "checkOut", Closed: "closed" };
  const advance = async (patient, newStatus) => {
    setBusyId(patient._id);
    try {
      await dispatch(updateAppointment({ _id: patient._id, body: { bookingStatus: { [STATUS_KEYS[newStatus]]: new Date() } } })).unwrap();
      toast.success(`Moved to ${newStatus}`);
      getAppointmentData();
    } catch (error) {
      toast.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const updatePatientToCheckedOut = async (patientId) => {
    if (!patientId) {
      console.log("No patient ID provided for checkout");
      return;
    }
    
    console.log("Updating patient to checked out:", patientId);
    
    const patient = prescriptionData.find((item) => item._id === patientId);
    if (!patient) {
      console.error("Patient not found in prescriptionData");
      return;
    }

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
          <div className={channelName ? "hidden" : "space-y-4 p-3"}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Video consultation queue</h2>
                <p className="text-xs text-slate-500">
                  Teleconsults only. In-person visits are in{" "}
                  <button onClick={() => navigate("/appointments")} className="font-medium text-brand-600 hover:text-brand-700">
                    Appointments <ArrowRight className="inline h-3 w-3" />
                  </button>
                </p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-sm">
                {[
                  ["today", "Today"],
                  ["upcoming", "Upcoming"],
                  ["all", "All"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setScope(key)}
                    className={`rounded-md px-3 py-1 font-medium ${scope === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Tabs defaultValue="Patient Details">
              <TabsList>
                <TabsTrigger value="Patient Details">
                  <StethoscopeIcon className="w-4 h-4" />
                  <span className="ml-2">Board</span>
                </TabsTrigger>
                <TabsTrigger value="Table">
                  <TableIcon className="w-4 h-4" />
                  <span className="ml-2">Table</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="Patient Details">
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
                  {initialStatuses.map((status) => {
                    const items = filteredData[status.display] || [];
                    return (
                    <div
                      key={status.display}
                      className="flex h-[560px] flex-col rounded-xl border border-slate-200 bg-slate-50/70"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <span className={`h-2 w-2 rounded-full ${COLUMN_DOTS[status.display]}`} />
                          {status.display}
                        </h3>
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{items.length}</span>
                      </div>
                      <ScrollArea className={`flex-1 [&>[data-radix-scroll-area-viewport]>div]:!block`}>
                        <div
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => onTaskDrop(event, status.display)}
                          className="min-h-[480px] p-2.5"
                        >
                          {items.length === 0 ? (
                            <p className="px-2 py-8 text-center text-xs text-slate-400">{COLUMN_EMPTY[status.display]}</p>
                          ) : (
                            items.map((patient) => (
                              <PatientColumn
                                key={patient._id}
                                patient={patient}
                                setChannelName={setChannelName}
                                setStatus={setStatus}
                                setCurrentPatientId={setCurrentPatientId}
                                onAdvance={advance}
                                busy={busyId === patient._id}
                              />
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                    );
                  })}
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
          {isSheetOpen && currentPatientId && (
            // Prescription panel beside the video call: writes against this appointment.
            <aside className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-4xl flex-col border-l border-slate-200 bg-slate-50 shadow-2xl" aria-label="Prescription">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
                <h2 className="text-base font-semibold text-slate-900">Prescription</h2>
                <button type="button" onClick={() => setIsSheetOpen(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close prescription">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <PrescriptionComposer embedded appointmentId={currentPatientId} onSigned={() => getAppointmentData()} />
              </div>
            </aside>
          )}
        </>: 
        <div className="min-h-full  flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-96 w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-[#e6f4f1] p-4">
                <Calendar className="w-8 h-8 text-brand-500" />
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