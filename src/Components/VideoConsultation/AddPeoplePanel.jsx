import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, Copy, Link2, Loader2, Search, Share2, ShieldCheck, Trash2, UserPlus, X } from "lucide-react";
import { callApi, inviteUrl } from "../../util/callApi";

const TABS = [
  { key: "link", label: "Share link" },
  { key: "people", label: "From hospital" },
  { key: "requests", label: "Requests" },
];

/** Doctor's panel in a video call: share a guest link, add doctors/patients, approve patient requests. */
const AddPeoplePanel = ({ appointmentId, invites, onChanged, onClose }) => {
  const pending = invites.filter((i) => i.status === "pending");
  const [tab, setTab] = useState(pending.length ? "requests" : "link");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState("");
  const [q, setQ] = useState("");
  const [people, setPeople] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (tab !== "people") return undefined;
    const t = setTimeout(() => callApi.people(q.trim()).then(setPeople).catch(() => setPeople([])), 250);
    return () => clearTimeout(t);
  }, [q, tab]);

  const act = async (key, fn, ok) => {
    setBusy(key);
    try {
      await fn();
      if (ok) toast.success(ok);
      onChanged();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };
  const copy = async (i) => {
    await navigator.clipboard?.writeText(inviteUrl(i.token));
    setCopied(i._id);
    setTimeout(() => setCopied(""), 2000);
  };
  const links = invites.filter((i) => i.kind === "link" && i.status === "approved");
  const added = invites.filter((i) => i.kind === "user");
  const addedIds = new Set(added.map((i) => i.inviteeName));

  return (
    <aside className="absolute inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white text-slate-900 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold"><UserPlus className="h-5 w-5 text-blue-600" /> Add people to the call</h2>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex gap-1 border-b border-slate-200 px-3 pt-2">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`relative -mb-px rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium ${tab === t.key ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {t.label}
            {t.key === "requests" && pending.length > 0 && <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{pending.length}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === "link" && (
          <>
            <p className="text-sm text-slate-600">Create a link anyone can use to join – no account needed. Links work for 24 hours.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                act("create", () => callApi.createLink(appointmentId, label.trim() || undefined), "Invite link created");
                setLabel("");
              }}
              className="mt-3 flex gap-2"
            >
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Who is it for? (optional)" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="submit" disabled={busy === "create"} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:bg-blue-300">
                {busy === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />} Create link
              </button>
            </form>
            <ul className="mt-5 space-y-2">
              {links.map((i) => (
                <li key={i._id} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{i.label || "Guest link"}</span>
                    <span className="text-xs text-slate-500">{i.joinCount ? `joined ${i.joinCount}×` : "not used yet"}</span>
                  </div>
                  {i.requestedBy?.userType === "patient" && <p className="text-xs text-slate-500">Requested by {i.requestedBy.name}</p>}
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => copy(i)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-1.5 text-xs font-semibold hover:bg-slate-50">
                      {copied === i._id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />} {copied === i._id ? "Copied" : "Copy link"}
                    </button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Join the video consultation: ${inviteUrl(i.token)}`)}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      <Share2 className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <button type="button" onClick={() => act(i._id, () => callApi.revoke(i._id), "Link disabled")} className="rounded-lg border border-slate-300 px-2 text-slate-500 hover:text-rose-600" aria-label="Disable link" title="Disable link">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "people" && (
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors or patients by name, phone, speciality" className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            {added.length > 0 && (
              <p className="mt-3 text-xs text-slate-500">Added: {added.map((i) => i.inviteeName).join(", ")} – they see a “Join call” prompt in their app.</p>
            )}
            {!people ? (
              <p className="mt-6 text-center text-sm text-slate-400"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></p>
            ) : !people.length ? (
              <p className="mt-6 text-center text-sm text-slate-400">No one found.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {people.map((p) => {
                  const isAdded = addedIds.has(p.name);
                  return (
                    <li key={p._id} className="flex items-center gap-3 py-2.5">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${p.userType === "practitioner" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                        {p.name.replace(/^Dr\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="block truncate text-xs text-slate-500">{p.userType === "practitioner" ? "Doctor" : "Patient"}{p.detail ? ` · ${p.detail}` : ""}</span>
                      </span>
                      <button
                        type="button"
                        disabled={isAdded || busy === p._id}
                        onClick={() => act(p._id, () => callApi.addPerson(appointmentId, p._id), `${p.name} added – they can join from their app`)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {isAdded ? "Added" : busy === p._id ? "Adding…" : "Add"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {tab === "requests" && (
          <>
            <p className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> Patients can ask to bring someone in. They only get a working link after you approve.</p>
            {!pending.length ? (
              <p className="mt-6 text-center text-sm text-slate-400">No pending requests.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {pending.map((i) => (
                  <li key={i._id} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
                    <p><b>{i.requestedBy?.name}</b> wants to invite <b>{i.label}</b></p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" disabled={busy === i._id} onClick={() => act(i._id, () => callApi.approve(i._id), `${i.label} can now join`)} className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white">Approve</button>
                      <button type="button" disabled={busy === i._id} onClick={() => act(i._id, () => callApi.reject(i._id), "Request declined")} className="flex-1 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold">Decline</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default AddPeoplePanel;
