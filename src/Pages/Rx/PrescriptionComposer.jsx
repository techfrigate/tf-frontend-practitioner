import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addDays, format } from "date-fns";
import {
  AlertTriangle, BedDouble, CheckCircle2, ClipboardCheck, Copy, Eye, EyeOff, FileSignature, FlaskConical, HeartPulse, History,
  Loader2, MessageSquareText, Monitor, Pill, Printer, ShieldAlert, Stethoscope, Trash2, User, X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Modal, Spinner } from "../../Components/Common/ui";
import ConceptPicker from "../../Components/Rx/ConceptPicker";
import MedicationEditor from "../../Components/Rx/MedicationEditor";
import RxDocument from "../../Components/Rx/RxDocument";
import { ADVICE_SNIPPETS, FOLLOW_UPS, ageOf, allergyConflict, autoQuantity, nameOf, rxApi } from "../../util/prescriptionApi";

const EMPTY = {
  vitals: {},
  complaints: [],
  diagnoses: [],
  allergies: [],
  noKnownAllergies: false,
  medications: [],
  investigations: [],
  clinicalNotes: "",
  advice: "",
  followUpDate: "",
  followUpNote: "",
};
const CONTENT_KEYS = Object.keys(EMPTY);
const pickContent = (rx) => Object.fromEntries(CONTENT_KEYS.map((k) => [k, rx?.[k] ?? EMPTY[k]]));
const toConcept = (s) => ({ system: s.code ? s.system : undefined, code: s.code, display: s.display });

const Section = ({ icon: Icon, title, hint, count, children, tone = "brand" }) => (
  <Card className="p-5">
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone === "rose" ? "bg-rose-50 text-rose-600" : "bg-brand-50 text-brand-600"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {title} {count ? <span className="ml-1 rounded-full bg-slate-100 px-1.5 text-xs text-slate-600">{count}</span> : null}
          </h3>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
    </div>
    {children}
  </Card>
);

const Chips = ({ items, label, onRemove, extra }) =>
  items.length ? (
    <div className="mb-3 flex flex-wrap gap-2">
      {items.map((x, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1 text-sm text-slate-800">
          <span title={x[label]?.code ? `SNOMED CT ${x[label].code}` : "Free text"}>{x[label]?.display}</span>
          {extra?.(x, i)}
          <button type="button" onClick={() => onRemove(i)} className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700" aria-label="Remove">
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  ) : null;

const VitalInput = ({ label, unit, value, onChange, placeholder, width = "w-20" }) => (
  <label className="text-xs font-medium text-slate-600">
    {label}
    <span className="mt-1 flex items-center gap-1">
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={label === "BP" ? "text" : "decimal"}
        className={`${width} rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none`}
      />
      {unit && <span className="text-[11px] font-normal text-slate-400">{unit}</span>}
    </span>
  </label>
);

/**
 * Write a prescription for an OPD appointment (in-person or teleconsultation) or an IPD admission
 * (inpatient order / discharge prescription). Drafts autosave; signing shares it with the patient.
 */
const PrescriptionComposer = ({ appointmentId: apptProp, admissionId: admProp, kind: kindProp, embedded = false, onSigned }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = apptProp || params.get("appointmentId") || undefined;
  const admissionId = admProp || params.get("admissionId") || undefined;
  const kind = kindProp || params.get("kind") || undefined;
  const draftId = params.get("draft") || undefined; // e.g. an amendment in progress

  const [ctx, setCtx] = useState(null);
  const [error, setError] = useState("");
  const [rxId, setRxId] = useState(null);
  const [meta, setMeta] = useState({});
  const [form, setForm] = useState(EMPTY);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(null);
  const [showPreview, setShowPreview] = useState(!embedded);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmSign, setConfirmSign] = useState(false);
  const dirty = useRef(false);
  const creating = useRef(null);

  // ---- load the encounter and any draft to resume
  useEffect(() => {
    setCtx(null);
    Promise.all([rxApi.context({ appointmentId, admissionId }), draftId ? rxApi.get(draftId) : null])
      .then(([c, explicit]) => {
        setCtx(c);
        const fromContext = c.draft && (!kind || c.draft.kind === kind || c.encounter.type === "OPD") ? c.draft : null;
        const draft = explicit?.status === "draft" ? explicit : fromContext;
        if (draft) {
          setRxId(draft._id);
          setMeta(draft);
          setForm({ ...EMPTY, ...pickContent(draft), followUpDate: draft.followUpDate ? format(new Date(draft.followUpDate), "yyyy-MM-dd") : "" });
          setSaveState("saved");
        } else {
          setForm({
            ...EMPTY,
            allergies: c.knownAllergies || [],
            noKnownAllergies: !!c.noKnownAllergies,
            vitals: c.encounter.lastVitals ? { ...c.encounter.lastVitals } : {},
          });
        }
      })
      .catch((e) => setError(e.message));
  }, [appointmentId, admissionId, kind, draftId]);

  const payload = useCallback(
    (f) => ({
      ...f,
      medications: f.medications.map(({ strengths, stock, ...m }) => ({ ...m, quantity: m.quantity ?? autoQuantity(m) })),
      followUpDate: f.followUpDate || null,
    }),
    []
  );

  // ---- autosave (create the draft on the first change)
  useEffect(() => {
    if (!ctx || signed || !dirty.current) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        if (rxId) {
          await rxApi.update(rxId, payload(form));
        } else {
          if (!creating.current) creating.current = rxApi.create({ appointmentId, admissionId, kind, ...payload(form) });
          const created = await creating.current;
          setRxId(created._id);
          setMeta(created);
        }
        setSaveState("saved");
      } catch (e) {
        setSaveState("error");
        toast.error(e.message);
      }
    }, 900);
    return () => clearTimeout(t);
  }, [form, ctx, rxId, signed, appointmentId, admissionId, kind, payload]);

  const update = (patch) => {
    dirty.current = true;
    setForm((f) => ({ ...f, ...(typeof patch === "function" ? patch(f) : patch) }));
  };
  const setVital = (k, v) => update((f) => ({ vitals: { ...f.vitals, [k]: v } }));

  const conflicts = useMemo(
    () => form.medications.map((m) => allergyConflict(`${m.medication.display} ${m.brandName || ""}`, form.allergies)).filter(Boolean),
    [form.medications, form.allergies]
  );

  const copyFrom = (rx) => {
    update((f) => ({
      medications: [...f.medications, ...(rx.medications || []).map(({ _id, ...m }) => ({ ...m, quantity: undefined }))],
      diagnoses: f.diagnoses.length ? f.diagnoses : (rx.diagnoses || []).map(({ _id, ...d }) => d),
    }));
    setHistoryOpen(false);
    toast.success(`Copied ${(rx.medications || []).length} medicine(s) from ${rx.prescriptionNumber}`);
  };

  const sign = async () => {
    setConfirmSign(false);
    setSigning(true);
    try {
      let id = rxId;
      if (!id) {
        const created = await rxApi.create({ appointmentId, admissionId, kind, ...payload(form) });
        id = created._id;
        setRxId(id);
      }
      const done = await rxApi.finalize(id, payload(form));
      setSigned(done);
      setSaveState("idle");
      toast.success("Prescription signed and shared with the patient");
      onSigned?.(done);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSigning(false);
    }
  };

  const startSign = () => {
    if (!form.medications.length && !form.investigations.length && !form.advice && !form.diagnoses.length) {
      toast.error("Add at least a diagnosis, a medicine, a test or advice.");
      return;
    }
    if (form.vitals.bp && !/^\d{2,3}\/\d{2,3}$/.test(form.vitals.bp)) {
      toast.error("Blood pressure is incomplete – enter it like 120/80, or clear it.");
      return;
    }
    if (!form.noKnownAllergies && !form.allergies.length) {
      toast.error("Record allergies or tick “No known allergies” before signing.");
      document.getElementById("rx-allergies")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setConfirmSign(true);
  };

  const discard = async () => {
    if (!window.confirm("Discard this draft prescription?")) return;
    try {
      if (rxId) await rxApi.discard(rxId);
      toast.success("Draft discarded");
      embedded ? setForm(EMPTY) : navigate(-1);
      setRxId(null);
      dirty.current = false;
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (error) return <Card><EmptyState icon={AlertTriangle} title="Can't open the prescription" description={error} action={!embedded && <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>} /></Card>;
  if (!ctx) return <Spinner />;

  const { patient, encounter, doctor, location } = ctx;
  const isIPD = encounter.type === "IPD";
  const rxKind = isIPD ? (kind === "discharge" || meta.kind === "discharge" ? "discharge" : "inpatient-order") : "consultation";
  const title = isIPD ? (rxKind === "discharge" ? "Discharge prescription" : "Inpatient medication order") : "Prescription";
  const previewRx = { ...form, ...meta, ...form, careSetting: encounter.type, kind: rxKind, visitMode: isIPD ? "Inpatient" : encounter.visitMode, admissionNumber: encounter.admissionNumber, status: "draft", medications: form.medications.map((m) => ({ ...m, quantity: m.quantity ?? autoQuantity(m) })) };

  // ---- signed: confirmation screen
  if (signed) {
    return (
      <div className={embedded ? "space-y-4" : "mx-auto max-w-4xl space-y-5"}>
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{title} signed · {signed.prescriptionNumber}</h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              {nameOf(patient)} can now see it in the Health Frigate patient app.
              {!isIPD && " The consultation has been marked complete."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button icon={Printer} onClick={() => window.open(`/prescriptions/${signed._id}?print=1`, "_blank")}>Print</Button>
              <Button variant="secondary" icon={Eye} onClick={() => navigate(`/prescriptions/${signed._id}`)}>Open prescription</Button>
              {!embedded && (
                <Button variant="secondary" onClick={() => navigate(isIPD ? `/ipd/admissions/${encounter.admissionId}` : "/appointments")}>
                  {isIPD ? "Back to admission" : "Back to appointments"}
                </Button>
              )}
            </div>
          </div>
        </Card>
        {!embedded && <RxDocument rx={signed} />}
      </div>
    );
  }

  const saveLabel = { saving: "Saving draft…", saved: "Draft saved", error: "Couldn't save – retrying on next change", idle: rxId ? "Draft saved" : "Not saved yet" }[saveState];

  return (
    <div className="space-y-4">
      {/* Patient banner */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {patient.imageUrl ? (
              <img src={patient.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><User className="h-6 w-6" /></span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{nameOf(patient)}</h2>
                <span className="text-sm text-slate-500">{[ageOf(patient.dob) !== null && `${ageOf(patient.dob)}y`, patient.gender?.[0]?.toUpperCase()].filter(Boolean).join(" · ")}</span>
                <Badge color={isIPD ? "violet" : encounter.visitMode === "Teleconsultation" ? "blue" : "green"}>
                  {isIPD ? `IPD · ${encounter.admissionNumber}` : `OPD · ${encounter.visitMode}`}
                </Badge>
                {rxKind === "discharge" && <Badge color="amber">Discharge</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {[patient.uhid && `UHID ${patient.uhid}`, patient.phoneNumber?.value && `${patient.phoneNumber.dialCode || ""} ${patient.phoneNumber.value}`, isIPD ? encounter.bed : location?.name, isIPD && encounter.reason].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {form.allergies.length ? (
                  form.allergies.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                      <ShieldAlert className="h-3 w-3" /> {a.substance.display}
                    </span>
                  ))
                ) : form.noKnownAllergies ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">No known allergies</span>
                ) : (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Allergies not recorded</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={History} onClick={() => setHistoryOpen(true)}>
              History {ctx.history.length ? `(${ctx.history.length})` : ""}
            </Button>
            {ctx.lastPrescription?.medications?.length > 0 && (
              <Button variant="secondary" icon={Copy} onClick={() => copyFrom(ctx.lastPrescription)}>Repeat last medicines</Button>
            )}
            {embedded && (
              <Button variant="ghost" icon={showPreview ? EyeOff : Eye} onClick={() => setShowPreview((s) => !s)}>{showPreview ? "Hide" : "Preview"}</Button>
            )}
          </div>
        </div>
      </Card>

      {ctx.encounterPrescriptions?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-4 py-2.5 text-sm text-sky-800">
          <ClipboardCheck className="h-4 w-4" />
          Already issued for this {isIPD ? "admission" : "visit"}:
          {ctx.encounterPrescriptions.map((r) => (
            <button key={r._id} type="button" onClick={() => navigate(`/prescriptions/${r._id}`)} className="font-semibold underline-offset-2 hover:underline">
              {r.prescriptionNumber}
            </button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 ${showPreview && !embedded ? "xl:grid-cols-[minmax(0,1fr)_28rem]" : ""}`}>
        <div className="min-w-0 space-y-4">
          <Section icon={HeartPulse} title="Vitals" hint="Optional – recorded on the prescription and in the patient's record">
            <div className="flex flex-wrap gap-4">
              <div>
                <VitalInput label="BP" unit="mmHg" placeholder="120/80" width="w-24" value={form.vitals.bp} onChange={(v) => setVital("bp", v.replace(/[^\d/]/g, ""))} />
                {form.vitals.bp && !/^\d{2,3}\/\d{2,3}$/.test(form.vitals.bp) && <p className="mt-1 text-[11px] text-amber-600">Enter as systolic/diastolic, e.g. 120/80</p>}
              </div>
              <VitalInput label="Pulse" unit="/min" value={form.vitals.pulse} onChange={(v) => setVital("pulse", v)} />
              <VitalInput label="Temp" unit="°F" value={form.vitals.temperature} onChange={(v) => setVital("temperature", v)} />
              <VitalInput label="SpO₂" unit="%" value={form.vitals.spo2} onChange={(v) => setVital("spo2", v)} />
              <VitalInput label="Resp. rate" unit="/min" value={form.vitals.respiratoryRate} onChange={(v) => setVital("respiratoryRate", v)} />
              <VitalInput label="Weight" unit="kg" value={form.vitals.weight} onChange={(v) => setVital("weight", v)} />
              <VitalInput label="Height" unit="cm" value={form.vitals.height} onChange={(v) => setVital("height", v)} />
            </div>
          </Section>

          <Section icon={MessageSquareText} title="Chief complaints" hint="What the patient came with" count={form.complaints.length}>
            <Chips
              items={form.complaints}
              label="concept"
              onRemove={(i) => update((f) => ({ complaints: f.complaints.filter((_, j) => j !== i) }))}
              extra={(c, i) => (
                <input
                  value={c.duration || ""}
                  onChange={(e) => update((f) => ({ complaints: f.complaints.map((x, j) => (j === i ? { ...x, duration: e.target.value } : x)) }))}
                  placeholder="since…"
                  className="w-20 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none"
                />
              )}
            />
            <ConceptPicker type="finding" placeholder="e.g. fever, cough, headache…" onPick={(s) => update((f) => ({ complaints: [...f.complaints, { concept: toConcept(s), duration: "" }] }))} />
          </Section>

          <Section icon={Stethoscope} title="Diagnosis" hint="Provisional until confirmed" count={form.diagnoses.length}>
            <Chips
              items={form.diagnoses}
              label="concept"
              onRemove={(i) => update((f) => ({ diagnoses: f.diagnoses.filter((_, j) => j !== i) }))}
              extra={(d, i) => (
                <button
                  type="button"
                  onClick={() => update((f) => ({ diagnoses: f.diagnoses.map((x, j) => (j === i ? { ...x, status: x.status === "confirmed" ? "provisional" : "confirmed" } : x)) }))}
                  className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${d.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                  title="Click to change"
                >
                  {d.status === "confirmed" ? "Confirmed" : "Provisional"}
                </button>
              )}
            />
            <ConceptPicker type="finding" placeholder="e.g. type 2 diabetes, hypertension, URTI…" onPick={(s) => update((f) => ({ diagnoses: [...f.diagnoses, { concept: toConcept(s), status: "provisional" }] }))} />
          </Section>

          <Section icon={Pill} title={isIPD && rxKind !== "discharge" ? "Medication orders" : "Medicines"} hint="Pick from your usual medicines, the hospital pharmacy or SNOMED CT" count={form.medications.length}>
            {conflicts.length > 0 && (
              <p className="mb-3 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800">
                <AlertTriangle className="h-4 w-4" /> Allergy warning: check {conflicts.join(", ")}.
              </p>
            )}
            <MedicationEditor items={form.medications} onChange={(medications) => update({ medications })} locationId={location?._id} allergies={form.allergies} />
          </Section>

          <Section icon={FlaskConical} title="Investigations" hint="Lab tests and imaging" count={form.investigations.length}>
            <Chips
              items={form.investigations}
              label="test"
              onRemove={(i) => update((f) => ({ investigations: f.investigations.filter((_, j) => j !== i) }))}
              extra={(t, i) => (
                <select
                  value={t.priority || "routine"}
                  onChange={(e) => update((f) => ({ investigations: f.investigations.map((x, j) => (j === i ? { ...x, priority: e.target.value } : x)) }))}
                  className={`rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] ${t.priority && t.priority !== "routine" ? "font-semibold text-rose-700" : ""}`}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                </select>
              )}
            />
            <ConceptPicker
              type="investigation"
              locationId={location?._id}
              placeholder="e.g. CBC, HbA1c, chest X-ray…"
              onPick={(s) => update((f) => ({ investigations: [...f.investigations, { test: toConcept(s), diagnosticId: s.diagnosticId, priority: "routine" }] }))}
            />
          </Section>

          <Section icon={ClipboardCheck} title="Examination & notes" hint="Findings – printed on the prescription">
            <textarea
              rows={2}
              value={form.clinicalNotes}
              onChange={(e) => update({ clinicalNotes: e.target.value })}
              placeholder="e.g. Throat congested, chest clear, no lymphadenopathy"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </Section>

          <Section icon={MessageSquareText} title="Advice & follow-up">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {ADVICE_SNIPPETS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => update((f) => ({ advice: f.advice?.includes(a) ? f.advice : `${f.advice ? `${f.advice.trim()} ` : ""}${a}` }))}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                >
                  + {a}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={form.advice}
              onChange={(e) => update({ advice: e.target.value })}
              placeholder="Diet, lifestyle and warning signs to watch for"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div>
                <p className="text-xs font-medium text-slate-600">Follow-up in</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {FOLLOW_UPS.map((f) => {
                    const date = format(addDays(new Date(), f.days), "yyyy-MM-dd");
                    return (
                      <button key={f.label} type="button" onClick={() => update({ followUpDate: form.followUpDate === date ? "" : date })} className={`rounded-md border px-2 py-1 text-xs font-medium ${form.followUpDate === date ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300 text-slate-700"}`}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="text-xs font-medium text-slate-600">
                or date
                <input type="date" min={format(new Date(), "yyyy-MM-dd")} value={form.followUpDate || ""} onChange={(e) => update({ followUpDate: e.target.value })} className="mt-1 block rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
              </label>
              <input value={form.followUpNote || ""} onChange={(e) => update({ followUpNote: e.target.value })} placeholder="Note (e.g. with reports)" className="min-w-[12rem] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
            </div>
          </Section>

          <div id="rx-allergies">
            <Section icon={ShieldAlert} tone="rose" title="Allergies" hint="Carried forward from earlier visits – please confirm" count={form.allergies.length}>
              <Chips
                items={form.allergies}
                label="substance"
                onRemove={(i) => update((f) => ({ allergies: f.allergies.filter((_, j) => j !== i) }))}
                extra={(a, i) => (
                  <input
                    value={a.reaction || ""}
                    onChange={(e) => update((f) => ({ allergies: f.allergies.map((x, j) => (j === i ? { ...x, reaction: e.target.value } : x)) }))}
                    placeholder="reaction"
                    className="w-24 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none"
                  />
                )}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <ConceptPicker type="allergen" placeholder="e.g. penicillin, peanut…" onPick={(s) => update((f) => ({ allergies: [...f.allergies, { substance: toConcept(s) }], noKnownAllergies: false }))} />
                </div>
                <label className={`flex items-center gap-2 text-sm ${form.allergies.length ? "text-slate-400" : "text-slate-700"}`}>
                  <input type="checkbox" disabled={form.allergies.length > 0} checked={form.noKnownAllergies && !form.allergies.length} onChange={(e) => update({ noKnownAllergies: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
                  No known allergies
                </label>
              </div>
            </Section>
          </div>
        </div>

        {showPreview && (
          <div className={embedded ? "" : "xl:sticky xl:top-4 xl:self-start"}>
            <Card className="max-h-[calc(100vh-7rem)] overflow-auto p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
              <RxDocument rx={previewRx} patient={patient} doctor={doctor} hospital={ctx.hospital} preview />
            </Card>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-20 -mx-1 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-1.5 text-xs ${saveState === "error" ? "text-rose-600" : "text-slate-500"}`}>
            {saveState === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {saveLabel}
            {meta.prescriptionNumber && <span className="text-slate-400">· {meta.prescriptionNumber}{meta.version > 1 ? ` v${meta.version}` : ""}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {rxId && <Button variant="ghost" icon={Trash2} onClick={discard}>Discard draft</Button>}
            {!embedded && <Button variant="secondary" onClick={() => navigate(-1)}>Save & close</Button>}
            <Button icon={FileSignature} loading={signing} onClick={startSign}>Sign & share with patient</Button>
          </div>
        </div>
      </div>

      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        size="max-w-2xl"
        title={`${nameOf(patient)} – previous prescriptions`}
        description="Copy medicines from an earlier prescription, or open it to read."
      >
        {!ctx.history.length ? (
          <p className="text-sm text-slate-500">No signed prescriptions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ctx.history.map((r) => (
              <li key={r._id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-slate-900">
                    {format(new Date(r.encounterDate), "d MMM yyyy")} · {r.careSetting}
                    {r.kind === "discharge" ? " discharge" : ""} · {r.signedByName}
                  </p>
                  <p className="truncate text-slate-600">{r.diagnoses.join(", ") || "No diagnosis recorded"}</p>
                  <p className="truncate text-xs text-slate-500">{r.medications.join(", ") || "No medicines"}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button variant="ghost" onClick={() => window.open(`/prescriptions/${r._id}`, "_blank")}>Open</Button>
                  {r.medicineCount > 0 && (
                    <Button
                      variant="secondary"
                      icon={Copy}
                      onClick={async () => {
                        try {
                          copyFrom(await rxApi.get(r._id));
                        } catch (e) {
                          toast.error(e.message);
                        }
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal
        open={confirmSign}
        onClose={() => setConfirmSign(false)}
        title={`Sign ${title.toLowerCase()}?`}
        description="Once signed it can't be edited – you can amend it to issue a corrected version."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmSign(false)}>Keep editing</Button>
            <Button icon={FileSignature} loading={signing} onClick={sign}>Sign & share</Button>
          </>
        }
      >
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2"><Pill className="h-4 w-4 text-brand-500" /> {form.medications.length} medicine(s), {form.investigations.length} test(s)</li>
          <li className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-brand-500" /> {form.diagnoses.map((d) => d.concept.display).join(", ") || "No diagnosis"}</li>
          <li className="flex items-center gap-2">{isIPD ? <BedDouble className="h-4 w-4 text-brand-500" /> : <Monitor className="h-4 w-4 text-brand-500" />} Shared with {nameOf(patient)} in their app{!isIPD && "; the consultation will be marked complete"}</li>
          {conflicts.length > 0 && (
            <li className="flex items-center gap-2 font-semibold text-rose-700"><AlertTriangle className="h-4 w-4" /> Allergy warning: {conflicts.join(", ")}</li>
          )}
        </ul>
      </Modal>
    </div>
  );
};

export default PrescriptionComposer;
