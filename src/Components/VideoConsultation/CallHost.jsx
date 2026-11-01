import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useMeeting } from "../../Context/MeetingContext";
import { getPrescriptions, updateAppointment } from "../../Store/appointmentSlice";
import VideoConsultation from "../../Pages/Prescription/VideoConsultation";
import PrescriptionComposer from "../../Pages/Rx/PrescriptionComposer";

/** Renders the call above the routes, so it keeps running (minimised) while the doctor moves around the app. */
const CallHost = () => {
  const { call, endCall, isMinimized } = useMeeting();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [call?.appointmentId]);

  if (!call) return null;

  const refreshQueue = () => dispatch(getPrescriptions({ practitionerId: profileData?._id }));

  const checkOut = async (appointmentId) => {
    if (call.guest) return; // a doctor added to someone else's call doesn't end that visit
    try {
      await dispatch(updateAppointment({ _id: appointmentId, body: { bookingStatus: { checkOut: new Date() } } })).unwrap();
      toast.success("Patient status updated to Checked Out");
      refreshQueue();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className={isMinimized ? "" : "fixed inset-0 z-50 bg-slate-900"}>
        <VideoConsultation
          key={call.appointmentId}
          channelName={call.channelName}
          setChannelName={endCall}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          currentPatientId={call.appointmentId}
          updatePatientToCheckedOut={checkOut}
        />
      </div>
      {isSheetOpen && (
        // Prescription panel beside the video call: writes against this appointment.
        <aside className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-4xl flex-col border-l border-slate-200 bg-slate-50 shadow-2xl" aria-label="Prescription">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
            <h2 className="text-base font-semibold text-slate-900">Prescription</h2>
            <button type="button" onClick={() => setIsSheetOpen(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close prescription">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PrescriptionComposer embedded appointmentId={call.appointmentId} onSigned={refreshQueue} />
          </div>
        </aside>
      )}
    </>
  );
};

export default CallHost;
