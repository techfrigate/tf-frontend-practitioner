import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, X } from "lucide-react";
import { callApi } from "../../util/callApi";

/** Shows video calls this doctor has been added to, with a Join button. */
const CallInviteBanner = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [dismissed, setDismissed] = useState(() => new Set());

  useEffect(() => {
    const load = () => callApi.myInvites().then(setInvites).catch(() => {});
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const shown = invites.filter((i) => !dismissed.has(i._id));
  if (!shown.length) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[70] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 space-y-2">
      {shown.map((i) => (
        <div key={i._id} className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500"><Video className="h-5 w-5" /></span>
          <p className="min-w-0 flex-1 text-sm"><b>{i.invitedBy || "A colleague"}</b> added you to a video consultation.</p>
          <button
            type="button"
            onClick={() => {
              setDismissed((d) => new Set(d).add(i._id));
              navigate(`/worklist?joinAppointment=${i.appointmentId}&channel=${i.channelName}`);
            }}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-600"
          >
            Join
          </button>
          <button type="button" onClick={() => setDismissed((d) => new Set(d).add(i._id))} className="rounded p-1 text-slate-400 hover:text-white" aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
};

export default CallInviteBanner;
