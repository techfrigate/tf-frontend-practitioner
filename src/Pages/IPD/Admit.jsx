import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { BedDouble, Check, Search, UserPlus, X } from "lucide-react";
import { Button, Card, Field, PageHeader, inputClass } from "../../Components/Common/ui";
import { ADMISSION_TYPES, PAYMENT_METHODS, ageSex, fullName, inr, ipdApi } from "../../util/ipdApi";
import { BedPicker, LocationSelect, useIpdLocations } from "./common";

const Step = ({ n, title, done, children, aside }) => (
  <Card className="p-5">
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
            done ? "bg-emerald-500 text-white" : "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {aside}
    </div>
    {children}
  </Card>
);

const PatientPicker = ({ value, onChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) return;
    setLoading(true);
    const t = setTimeout(() => {
      ipdApi
        .searchPatients(query.trim())
        .then(setResults)
        .catch((e) => toast.error(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query, value]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{fullName(value)}</p>
          <p className="text-xs text-slate-600">
            {[ageSex(value), value.phoneNumber?.value && `${value.phoneNumber.dialCode || ""} ${value.phoneNumber.value}`, value.uhid && `UHID ${value.uhid}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <Button variant="ghost" icon={X} onClick={() => onChange(null)}>Change</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone, email or UHID"
          className={`${inputClass} pl-9`}
        />
      </div>
      <div className="mt-2 max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
        {loading && !results.length ? (
          <p className="px-4 py-3 text-sm text-slate-500">Searching…</p>
        ) : results.length ? (
          results.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => onChange(p)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50"
            >
              <span>
                <span className="block text-sm font-medium text-slate-900">{fullName(p)}</span>
                <span className="block text-xs text-slate-500">
                  {[ageSex(p), p.phoneNumber?.value, p.email].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="text-xs font-medium text-brand-600">Select</span>
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-slate-500">No patients found.</p>
        )}
      </div>
      <button type="button" onClick={() => navigate("/new-patient")} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        <UserPlus className="h-4 w-4" /> Register a new patient
      </button>
    </div>
  );
};

const Admit = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const profile = useSelector((s) => s.profile.profileData);
  const { locations, locationId, setLocationId } = useIpdLocations(params.get("location"));

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [admissionType, setAdmissionType] = useState("elective");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [admittedAt, setAdmittedAt] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [attendantName, setAttendantName] = useState("");
  const [attendantPhone, setAttendantPhone] = useState("");
  const [bed, setBed] = useState(() =>
    params.get("bed")
      ? { buildingId: params.get("building"), floorId: params.get("floor"), wardId: params.get("ward"), bedId: params.get("bed"), label: "Bed chosen on the bed board" }
      : null
  );
  const [deposit, setDeposit] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!locationId) return;
    ipdApi
      .doctorsAt(locationId)
      .then((list) => {
        setDoctors(list);
        setDoctorId((cur) => cur || (list.some((d) => d._id === profile?._id) ? profile._id : list[0]?._id || ""));
      })
      .catch(() => setDoctors([]));
  }, [locationId, profile]);

  const doctor = useMemo(() => doctors.find((d) => d._id === doctorId), [doctors, doctorId]);

  const submit = async () => {
    const e = {};
    if (!patient) e.patient = "Select the patient to admit.";
    if (!doctorId) e.doctor = "Choose the attending doctor.";
    if (!reason.trim()) e.reason = "Enter the reason for admission or provisional diagnosis.";
    if (!bed) e.bed = "Pick a free bed.";
    if (deposit && !(Number(deposit) > 0)) e.deposit = "Enter a valid amount or leave it empty.";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return;
    }
    setSaving(true);
    try {
      const admission = await ipdApi.admit({
        locationId,
        patientId: patient._id,
        attendingPractitionerId: doctorId,
        admissionType,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
        admittedAt: new Date(admittedAt).toISOString(),
        attendantName: attendantName.trim() || undefined,
        attendantPhone: attendantPhone.trim() || undefined,
        bed,
        deposit: Number(deposit) > 0 ? { amount: Number(deposit), method, reference: reference.trim() || undefined } : undefined,
      });
      toast.success(`${fullName(patient)} admitted · ${admission.admissionNumber}`);
      navigate(`/ipd/admissions/${admission._id}`);
    } catch (err) {
      toast.error(err.message);
      if (/bed/i.test(err.message)) setBed(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Admit patient"
        description="Create an inpatient admission and assign a bed."
        actions={locations?.length > 1 && <LocationSelect locations={locations} value={locationId} onChange={(id) => { setLocationId(id); setBed(null); }} />}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <Step n={1} title="Patient" done={!!patient}>
            <PatientPicker value={patient} onChange={setPatient} />
            {errors.patient && <p className="mt-2 text-xs text-rose-600">{errors.patient}</p>}
          </Step>

          <Step n={2} title="Admission details" done={!!(doctorId && reason.trim())}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Attending doctor" error={errors.doctor}>
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className={inputClass}>
                  {!doctors.length && <option value="">No doctors at this location</option>}
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      Dr. {fullName(d)}{d.work?.speciality ? ` – ${d.work.speciality}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Admitted on">
                <input type="datetime-local" value={admittedAt} max={format(new Date(), "yyyy-MM-dd'T'HH:mm")} onChange={(e) => setAdmittedAt(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="mt-4">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Admission type</span>
              <div className="flex flex-wrap gap-2">
                {ADMISSION_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setAdmissionType(t.value)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      admissionType === t.value ? "border-brand-500 bg-brand-50 font-medium text-brand-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Field label="Reason for admission / provisional diagnosis" error={errors.reason}>
                <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Dengue fever with low platelets" className={inputClass} />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Attendant name" hint="Relative or guardian staying with the patient">
                  <input value={attendantName} onChange={(e) => setAttendantName(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Attendant phone">
                  <input value={attendantPhone} onChange={(e) => setAttendantPhone(e.target.value)} className={inputClass} />
                </Field>
              </div>
              <Field label="Admission notes (optional)">
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, insurance details, special instructions…" className={inputClass} />
              </Field>
            </div>
          </Step>

          <Step
            n={3}
            title="Bed"
            done={!!bed}
            aside={bed && <span className="text-xs font-medium text-brand-700">{bed.label}</span>}
          >
            <BedPicker locationId={locationId} value={bed} onChange={setBed} />
            {errors.bed && <p className="mt-2 text-xs text-rose-600">{errors.bed}</p>}
          </Step>

          <Step n={4} title="Advance deposit (optional)" done={Number(deposit) > 0}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Amount (₹)" error={errors.deposit}>
                <input type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" className={inputClass} />
              </Field>
              <Field label="Payment method">
                <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reference / receipt no.">
                <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
              </Field>
            </div>
          </Step>
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900">Summary</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                ["Patient", patient ? fullName(patient) : "—"],
                ["Doctor", doctor ? `Dr. ${fullName(doctor)}` : "—"],
                ["Type", ADMISSION_TYPES.find((t) => t.value === admissionType)?.label],
                ["Bed", bed ? bed.label : "—"],
                ["Bed charge", bed?.dailyRate !== undefined ? `${inr(bed.dailyRate)} / day` : "—"],
                ["Deposit", Number(deposit) > 0 ? inr(deposit) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
            <Button className="mt-5 w-full" icon={BedDouble} loading={saving} onClick={submit}>
              Admit patient
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate("/ipd")}>Cancel</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admit;
