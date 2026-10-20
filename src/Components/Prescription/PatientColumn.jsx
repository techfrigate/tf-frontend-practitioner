import React from "react";
import { format, isToday } from "date-fns";
import { CheckCircle2, Clock, LogIn, LogOut, Phone, Video } from "lucide-react";
import { calculateAge } from "../../util/patientUtil.js";
import { wallClock } from "../../util/clinicApi";

export const stageOf = (bookingStatus = {}) => {
  if (bookingStatus.closed) return "Closed";
  if (bookingStatus.checkOut) return "Checked Out";
  if (bookingStatus.checkIn) return "Checked In";
  return "Scheduled";
};

const PatientColumn = ({ patient, setChannelName, setStatus, setCurrentPatientId, onAdvance, busy }) => {
  const p = patient?.patientData || {};
  const stage = stageOf(patient.bookingStatus);
  const start = wallClock(patient.startDateTime);
  const end = wallClock(patient.endDateTime);
  const unpaid = patient.paymentStatus !== "completed";

  const onTaskDragStart = (event) => {
    event.dataTransfer.setData("text/plain", patient._id.toString());
  };

  const startCall = () => {
    setChannelName(patient.channelName.slice(0, 16));
    setStatus("Checked In");
    setCurrentPatientId(patient._id);
  };

  return (
    <div
      draggable
      onDragStart={onTaskDragStart}
      className="mb-2 cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
            {`${p.firstName?.[0] || ""}${p.lastName?.[0] || ""}`.toUpperCase() || "?"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{[p.firstName, p.lastName].filter(Boolean).join(" ") || "Patient"}</p>
          <p className="truncate text-xs text-slate-500">
            {[p.dob ? `${calculateAge(p.dob)}y` : null, p.gender ? p.gender[0].toUpperCase() : null].filter(Boolean).join(" · ")}
          </p>
        </div>
        {unpaid && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-600">Unpaid</span>}
      </div>

      <div className="mt-2.5 space-y-1 text-xs text-slate-600">
        <p className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          {isToday(start) ? "Today" : format(start, "EEE, d MMM")} · {format(start, "h:mm a")}–{format(end, "h:mm a")}
        </p>
        {p.phoneNumber?.value && (
          <p className="flex items-center gap-1.5 truncate">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            {p.phoneNumber.dialCode} {p.phoneNumber.value}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {stage === "Scheduled" && (
          <button
            disabled={busy}
            onClick={() => onAdvance(patient, "Checked In")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            <LogIn className="h-3.5 w-3.5" /> Check in
          </button>
        )}
        {stage === "Checked In" && (
          <>
            <button
              onClick={startCall}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-care-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-care-600"
            >
              <Video className="h-3.5 w-3.5" /> Start video call
            </button>
            <button
              disabled={busy}
              onClick={() => onAdvance(patient, "Checked Out")}
              className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              title="End consultation"
            >
              <LogOut className="h-3.5 w-3.5" /> End
            </button>
          </>
        )}
        {stage === "Checked Out" && (
          <button
            disabled={busy}
            onClick={() => onAdvance(patient, "Closed")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Close visit
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientColumn;
