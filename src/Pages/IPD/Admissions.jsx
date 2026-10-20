import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { BedDouble, ClipboardList, Search, UserPlus } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner, inputClass } from "../../Components/Common/ui";
import { ADMISSION_TYPES, ageSex, fullName, inr, ipdApi } from "../../util/ipdApi";
import { AdmissionStatus, LocationSelect, useIpdLocations } from "./common";

const TABS = [
  { key: "admitted", label: "Currently admitted" },
  { key: "discharged", label: "Discharged" },
  { key: "", label: "All" },
];

const Admissions = () => {
  const navigate = useNavigate();
  const { locations, locationId, setLocationId } = useIpdLocations();
  const [tab, setTab] = useState("admitted");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!locationId) return;
    setRows(null);
    const t = setTimeout(() => {
      ipdApi
        .list({ locationId, status: tab || undefined, search: search.trim() || undefined })
        .then(setRows)
        .catch((e) => {
          toast.error(e.message);
          setRows([]);
        });
    }, 200);
    return () => clearTimeout(t);
  }, [locationId, tab, search]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Admissions"
        description="Every inpatient stay with its bed, doctor and running bill."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {locations?.length > 1 && <LocationSelect locations={locations} value={locationId} onChange={setLocationId} />}
            <Button variant="secondary" icon={BedDouble} onClick={() => navigate("/ipd")}>Bed board</Button>
            <Button icon={UserPlus} onClick={() => navigate(`/ipd/admit?location=${locationId}`)}>Admit patient</Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key || "all"}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Patient, phone, IPD no. or ward" className={`${inputClass} pl-9`} />
          </div>
        </div>

        {!rows ? (
          <Spinner />
        ) : !rows.length ? (
          <EmptyState
            icon={ClipboardList}
            title={tab === "admitted" ? "No patients admitted" : "No admissions found"}
            description={tab === "admitted" ? "Admit a patient from the bed board or with the Admit patient button." : "Try another filter or search."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">IPD no.</th>
                  <th className="px-4 py-3">Ward / bed</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Admitted</th>
                  <th className="px-4 py-3">Stay</th>
                  <th className="px-4 py-3 text-right">Bill</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((a) => (
                  <tr key={a._id} onClick={() => navigate(`/ipd/admissions/${a._id}`)} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{fullName(a.patient)}</p>
                      <p className="text-xs text-slate-500">{[ageSex(a.patient), a.patient?.phoneNumber?.value].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-slate-700">{a.admissionNumber}</p>
                      <p className="text-xs text-slate-500">{ADMISSION_TYPES.find((t) => t.value === a.admissionType)?.label}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900">{a.bed?.wardName}</p>
                      <p className="text-xs text-slate-500">Bed {a.bed?.bedNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">Dr. {fullName(a.doctor)}</td>
                    <td className="px-4 py-3 text-slate-700">{format(new Date(a.admittedAt), "d MMM, h:mm a")}</td>
                    <td className="px-4 py-3 text-slate-700">{a.lengthOfStayDays} day{a.lengthOfStayDays > 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-medium text-slate-900">{inr(a.total)}</p>
                      {a.status === "admitted" ? (
                        <p className={`text-xs ${a.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {a.balance > 0 ? `${inr(a.balance)} due` : `${inr(-a.balance)} advance left`}
                        </p>
                      ) : (
                        a.billId && <p className="text-xs text-slate-500">Bill {a.billId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <AdmissionStatus status={a.status} />
                      {a.dischargeCondition && <Badge color="slate">{a.dischargeCondition}</Badge>}
                    </td>
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

export default Admissions;
