import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { FileText, Search } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader, Spinner, inputClass } from "../../Components/Common/ui";
import { STATUS_BADGE, ageOf, nameOf, rxApi } from "../../util/prescriptionApi";

const TABS = [
  { key: "", label: "All" },
  { key: "OPD", label: "OPD" },
  { key: "IPD", label: "IPD" },
];

const PrescriptionList = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const patientId = params.get("patientId") || undefined;
  const [careSetting, setCareSetting] = useState("");
  const [status, setStatus] = useState("");
  const [mine, setMine] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(null);
    const t = setTimeout(() => {
      rxApi
        .list({ patientId, careSetting: careSetting || undefined, status: status || undefined, mine: mine ? "true" : undefined, from: from || undefined, to: to || undefined, search: search.trim() || undefined })
        .then(setRows)
        .catch((e) => {
          setError(e.message);
          setRows([]);
        });
    }, 200);
    return () => clearTimeout(t);
  }, [patientId, careSetting, status, mine, from, to, search]);

  const patientName = patientId && rows?.[0] ? nameOf(rows[0].patient) : null;

  return (
    <div className="space-y-5">
      <PageHeader
        title={patientName ? `Prescriptions · ${patientName}` : "Prescriptions"}
        description="Every prescription written in this hospital – OPD consultations, inpatient orders and discharge prescriptions."
      />
      {patientId && (
        <button type="button" onClick={() => setParams({})} className="text-sm font-medium text-brand-700 hover:underline">
          ← Show all patients
        </button>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {TABS.map((t) => (
              <button key={t.key || "all"} type="button" onClick={() => setCareSetting(t.key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${careSetting === t.key ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}>
                {t.label}
              </button>
            ))}
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="ml-2 rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
              <option value="">Any status</option>
              <option value="final">Signed</option>
              <option value="draft">My drafts</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <label className="ml-2 flex items-center gap-1.5 text-sm text-slate-700">
              <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="h-4 w-4 rounded border-slate-300" /> Only mine
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
            <span className="text-slate-400">–</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Patient, Rx no., diagnosis, medicine" className={`${inputClass} pl-9`} />
            </div>
          </div>
        </div>

        {!rows ? (
          <Spinner />
        ) : !rows.length ? (
          <EmptyState icon={FileText} title={error || "No prescriptions found"} description="Prescriptions appear here once a doctor writes one from an appointment or admission." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Diagnosis</th>
                  <th className="px-4 py-3">Medicines</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r._id} onClick={() => navigate(r.status === "draft" ? (r.appointmentId ? `/prescriptions/write?appointmentId=${r.appointmentId}` : `/prescriptions/write?admissionId=${r.admissionId}&kind=${r.kind}`) : `/prescriptions/${r._id}`)} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-slate-900">{format(new Date(r.encounterDate), "d MMM yyyy")}</p>
                      <p className="font-mono text-[11px] text-slate-500">{r.prescriptionNumber}{r.version > 1 ? ` v${r.version}` : ""}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{nameOf(r.patient)}</p>
                      <p className="text-xs text-slate-500">{[ageOf(r.patient?.dob) !== null && `${ageOf(r.patient?.dob)}y`, r.patient?.gender, r.patient?.uhid].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="max-w-[14rem] truncate px-4 py-3 text-slate-700">{r.diagnoses.join(", ") || "—"}</td>
                    <td className="max-w-[16rem] truncate px-4 py-3 text-slate-700">{r.medications.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">Dr. {nameOf(r.doctor)}</td>
                    <td className="px-4 py-3">
                      <Badge color={r.careSetting === "IPD" ? "violet" : "blue"}>{r.careSetting}</Badge>
                      <p className="mt-0.5 text-[11px] text-slate-500">{r.kind === "discharge" ? "Discharge" : r.kind === "inpatient-order" ? "Inpatient order" : r.visitMode}</p>
                    </td>
                    <td className="px-4 py-3"><Badge color={STATUS_BADGE[r.status]?.color}>{STATUS_BADGE[r.status]?.label}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PrescriptionList;
