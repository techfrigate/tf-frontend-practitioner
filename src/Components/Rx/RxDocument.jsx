import React from "react";

/**
 * Printable prescription. Used for the live preview while writing, the doctor's view and the
 * patient's copy. Keep this file in sync with the copies in tf-frontend-patient and tf-frontend-admin.
 */
const FREQ = { OD: "Once a day", BD: "Twice a day", TDS: "Three times a day", QID: "Four times a day", HS: "At bedtime", SOS: "When needed", STAT: "Immediately, once" };
const FOOD = { after: "After food", before: "Before food", with: "With food", empty: "Empty stomach", bedtime: "At bedtime" };
const UNIT = { d: "day", wk: "week", mo: "month" };

const age = (dob) => {
  if (!dob) return null;
  const y = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  return Number.isFinite(y) ? `${y}y` : null;
};
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");
const name = (p) => [p?.firstName, p?.lastName].filter(Boolean).join(" ");
const squash = (x) => String(x || "").replace(/\s+/g, "").toLowerCase();
const medName = (m) => {
  const n = m.brandName || m.medication.display;
  return [n, m.strength && !squash(n).includes(squash(m.strength)) ? m.strength : null, m.form].filter(Boolean).join(" ");
};

const how = (m) => {
  if (m.pattern) return `${m.pattern}`;
  return m.frequency ? `${m.frequency}${FREQ[m.frequency] ? ` · ${FREQ[m.frequency]}` : ""}` : "";
};
const duration = (m) => (m.durationValue ? `${m.durationValue} ${UNIT[m.durationUnit || "d"]}${m.durationValue > 1 ? "s" : ""}` : "");

const Heading = ({ children }) => <h4 className="mb-1.5 mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{children}</h4>;

const RxDocument = ({ rx, patient, doctor, hospital, preview = false }) => {
  const p = patient || rx.patient || {};
  const d = doctor || rx.doctor || {};
  const h = hospital || rx.hospital || {};
  const v = rx.vitals || {};
  const vitals = [
    v.bp && `BP ${v.bp} mmHg`,
    v.pulse && `Pulse ${v.pulse}/min`,
    v.temperature && `Temp ${v.temperature}°F`,
    v.spo2 && `SpO₂ ${v.spo2}%`,
    v.respiratoryRate && `RR ${v.respiratoryRate}/min`,
    v.weight && `Wt ${v.weight} kg`,
    v.height && `Ht ${v.height} cm`,
  ].filter(Boolean);
  const cancelled = rx.status === "cancelled";

  return (
    <article className={`relative bg-white text-[13px] leading-relaxed text-slate-800 ${preview ? "" : "rounded-xl border border-slate-200 p-6 shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none"}`}>
      {cancelled && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="-rotate-12 rounded-lg border-4 border-rose-500/60 px-6 py-2 text-4xl font-black uppercase tracking-widest text-rose-500/60">Cancelled</span>
        </div>
      )}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-800 pb-3">
        <div>
          <p className="text-base font-bold text-slate-900">{h.name || "Hospital"}</p>
          {h.location && <p className="text-xs text-slate-600">{h.location}</p>}
          {h.address && <p className="text-xs text-slate-500">{[h.address.addressLine1, h.address.city, h.address.state, h.address.zipCode].filter(Boolean).join(", ")}</p>}
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">Dr. {name(d)}</p>
          <p className="text-xs text-slate-600">{[d.qualification, d.speciality].filter(Boolean).join(" · ")}</p>
          {d.registration && <p className="text-xs text-slate-500">Reg. No. {d.registration}</p>}
        </div>
      </header>

      <section className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
        <p><span className="text-slate-500">Patient</span><br /><b className="text-sm text-slate-900">{name(p) || "—"}</b></p>
        <p><span className="text-slate-500">Age / Sex</span><br /><b>{[age(p.dob), p.gender?.[0]?.toUpperCase()].filter(Boolean).join(" / ") || "—"}</b></p>
        <p><span className="text-slate-500">{p.uhid ? "UHID" : "Phone"}</span><br /><b>{p.uhid || p.phoneNumber?.value || "—"}</b></p>
        <p><span className="text-slate-500">Date</span><br /><b>{fmtDate(rx.signedAt || rx.encounterDate || new Date())}</b></p>
        <p className="col-span-2"><span className="text-slate-500">Rx No.</span> <b>{rx.prescriptionNumber || "Not yet issued"}</b>{rx.version > 1 && <span className="text-slate-500"> (version {rx.version})</span>}</p>
        <p className="col-span-2 sm:text-right"><span className="text-slate-500">Visit</span> <b>{rx.careSetting === "IPD" ? `Inpatient${rx.admissionNumber ? ` · ${rx.admissionNumber}` : ""}${rx.kind === "discharge" ? " · Discharge" : ""}` : rx.visitMode || "Outpatient"}</b></p>
      </section>

      {vitals.length > 0 && <p className="mt-3 rounded-md bg-slate-50 px-3 py-1.5 text-xs text-slate-700">{vitals.join("  ·  ")}</p>}

      {(rx.allergies?.length > 0 || rx.noKnownAllergies) && (
        <p className={`mt-2 text-xs ${rx.allergies?.length ? "font-semibold text-rose-700" : "text-slate-600"}`}>
          Allergies: {rx.allergies?.length ? rx.allergies.map((a) => a.substance.display + (a.reaction ? ` (${a.reaction})` : "")).join(", ") : "No known allergies"}
        </p>
      )}

      {rx.complaints?.length > 0 && (
        <>
          <Heading>Chief complaints</Heading>
          <p>{rx.complaints.map((c) => `${c.concept.display}${c.duration ? ` × ${c.duration}` : ""}`).join(", ")}</p>
        </>
      )}
      {rx.clinicalNotes && (
        <>
          <Heading>Examination</Heading>
          <p className="whitespace-pre-wrap">{rx.clinicalNotes}</p>
        </>
      )}
      {rx.diagnoses?.length > 0 && (
        <>
          <Heading>Diagnosis</Heading>
          <p>{rx.diagnoses.map((x) => `${x.concept.display}${x.status === "provisional" ? " (provisional)" : ""}`).join(", ")}</p>
        </>
      )}

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-serif text-2xl font-bold italic text-slate-900">℞</span>
        {!rx.medications?.length && <span className="text-xs text-slate-400">No medicines</span>}
      </div>
      {rx.medications?.length > 0 && (
        <table className="mt-1 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-300 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="py-1.5 pr-2 font-semibold">#</th>
              <th className="py-1.5 pr-2 font-semibold">Medicine</th>
              <th className="py-1.5 pr-2 font-semibold">Dose & frequency</th>
              <th className="py-1.5 pr-2 font-semibold">Duration</th>
              <th className="py-1.5 font-semibold">Qty</th>
            </tr>
          </thead>
          <tbody>
            {rx.medications.map((m, i) => (
              <tr key={i} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-2 text-slate-500">{i + 1}</td>
                <td className="py-2 pr-2">
                  <p className="font-semibold text-slate-900">{medName(m)}</p>
                  {m.brandName && !m.brandName.toLowerCase().includes(m.medication.display.toLowerCase()) && <p className="text-[11px] text-slate-500">{m.medication.display}</p>}
                </td>
                <td className="py-2 pr-2">
                  <p>{[m.doseValue && `${m.doseValue} ${m.doseUnit || ""}`, how(m)].filter(Boolean).join(" · ")}</p>
                  <p className="text-[11px] text-slate-500">{[m.foodTiming && FOOD[m.foodTiming], m.route?.display?.replace(/ route$/i, ""), m.asNeeded && "if needed"].filter(Boolean).join(" · ")}</p>
                  {m.instructions && <p className="text-[11px] italic text-slate-600">{m.instructions}</p>}
                </td>
                <td className="py-2 pr-2">{duration(m)}</td>
                <td className="py-2">{m.quantity || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rx.investigations?.length > 0 && (
        <>
          <Heading>Investigations advised</Heading>
          <ul className="list-disc pl-5">
            {rx.investigations.map((t, i) => (
              <li key={i}>
                {t.test.display}
                {t.priority && t.priority !== "routine" && <b className="ml-1 text-rose-700">({t.priority})</b>}
                {t.note && <span className="text-slate-500"> – {t.note}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
      {rx.advice && (
        <>
          <Heading>Advice</Heading>
          <p className="whitespace-pre-wrap">{rx.advice}</p>
        </>
      )}
      {rx.followUpDate && (
        <>
          <Heading>Follow-up</Heading>
          <p>
            {fmtDate(rx.followUpDate)}
            {rx.followUpNote && ` – ${rx.followUpNote}`}
          </p>
        </>
      )}

      <footer className="mt-8 flex items-end justify-between gap-4 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
        <p>
          {rx.status === "draft" || !rx.signedAt
            ? "Draft – not valid until signed by the doctor."
            : `Digitally signed by ${rx.signedByName || `Dr. ${name(d)}`} on ${new Date(rx.signedAt).toLocaleString("en-IN")}`}
          {rx.status === "cancelled" && rx.cancelReason && <span className="block font-medium text-rose-600">Cancelled: {rx.cancelReason}</span>}
        </p>
        <p className="text-right">
          Coded with SNOMED CT · HL7 FHIR R4
          <br />
          Health Frigate
        </p>
      </footer>
    </article>
  );
};

export default RxDocument;
