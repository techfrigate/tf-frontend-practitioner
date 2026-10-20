import React from "react";
import { AlertTriangle, Minus, Pill, Plus, Trash2 } from "lucide-react";
import ConceptPicker from "./ConceptPicker";
import {
  COUNTABLE, DURATION_UNITS, FOOD, FORMS, FREQUENCIES, PATTERNS, ROUTES, UNIT_FOR_FORM, allergyConflict, autoQuantity, sigText,
} from "../../util/prescriptionApi";

const chip = (on) =>
  `rounded-md border px-2 py-1 text-xs font-medium transition ${on ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`;

const routeFor = (code) => ROUTES.find((r) => r.code === code);

/** Build a new medicine row from a suggestion (favourite, pharmacy stock or SNOMED concept). */
export const medicationFromSuggestion = (s) => {
  if (s.source === "favourite" && s.defaults) {
    const { quantity, ...rest } = s.defaults;
    return { ...rest, quantity: undefined };
  }
  const form = s.form || "Tablet";
  const route = routeFor(s.route) || ROUTES[0];
  const unit = UNIT_FOR_FORM[form.toLowerCase()] || "unit";
  return {
    medication: { system: s.system, code: s.code, display: s.source === "pharmacy" ? s.genericName || s.display : s.display },
    brandName: s.source === "pharmacy" ? s.display : undefined,
    medicineId: s.medicineId,
    strength: s.strengths?.[0] || (s.source === "pharmacy" ? (s.display.match(/\d+(\.\d+)?\s?(mg|mcg|g|ml|iu)/i) || [])[0] : undefined),
    strengths: s.strengths,
    form,
    doseValue: ["syrup", "suspension"].includes(form.toLowerCase()) ? 5 : 1,
    doseUnit: unit,
    route: { code: route.code, display: route.display },
    frequency: "BD",
    // Food timing only makes sense for medicines taken by mouth.
    foodTiming: route.code === "26643006" ? "after" : undefined,
    durationValue: 5,
    durationUnit: "d",
    stock: s.stock,
  };
};

const MedicationRow = ({ m, index, onChange, onRemove, allergies, duplicate }) => {
  const set = (patch) => onChange({ ...m, ...patch });
  const conflict = allergyConflict(`${m.medication.display} ${m.brandName || ""}`, allergies);
  const qty = m.quantity ?? autoQuantity(m);
  const countable = COUNTABLE.includes(String(m.form || "").toLowerCase());
  const short = (m.stock !== undefined && qty && qty > m.stock) || m.stock === 0;

  return (
    <div className={`rounded-xl border p-4 ${conflict ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{index + 1}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {m.brandName || m.medication.display}
              {m.brandName && !m.brandName.toLowerCase().includes(m.medication.display.toLowerCase()) && <span className="ml-1.5 text-sm font-normal text-slate-500">({m.medication.display})</span>}
            </p>
            <p className="text-xs text-slate-500">
              {m.medication.code ? `SNOMED CT ${m.medication.code}` : "Free text (not coded)"}
              {m.stock !== undefined && ` · ${m.stock} in stock`}
            </p>
          </div>
        </div>
        <button type="button" onClick={onRemove} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove medicine">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {(conflict || duplicate || short) && (
        <div className="mt-3 space-y-1">
          {conflict && (
            <p className="flex items-center gap-1.5 rounded-md bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-800">
              <AlertTriangle className="h-3.5 w-3.5" /> Patient is allergic to {conflict}. Check before prescribing.
            </p>
          )}
          {duplicate && (
            <p className="flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" /> This medicine is already on the prescription.
            </p>
          )}
          {short && (
            <p className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" /> Pharmacy has only {m.stock} in stock.
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-medium text-slate-600">
            Strength
            <input
              list={`strengths-${index}`}
              value={m.strength || ""}
              onChange={(e) => set({ strength: e.target.value })}
              placeholder="e.g. 500 mg"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <datalist id={`strengths-${index}`}>{(m.strengths || []).map((s) => <option key={s} value={s} />)}</datalist>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Form
            <select
              value={m.form || ""}
              onChange={(e) => set({ form: e.target.value, doseUnit: UNIT_FOR_FORM[e.target.value.toLowerCase()] || m.doseUnit, quantity: undefined })}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            >
              {[...new Set([m.form, ...FORMS].filter(Boolean))].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <div className="text-xs font-medium text-slate-600">
            Dose
            <div className="mt-1 flex items-center gap-1">
              <button type="button" aria-label="Less" onClick={() => set({ doseValue: Math.max(0.25, (Number(m.doseValue) || 1) - (Number(m.doseValue) > 1 ? 1 : 0.25)), quantity: undefined })} className="rounded-md border border-slate-300 p-1.5 hover:bg-slate-50">
                <Minus className="h-3 w-3" />
              </button>
              <input
                value={m.doseValue ?? ""}
                onChange={(e) => set({ doseValue: e.target.value === "" ? undefined : Number(e.target.value), quantity: undefined })}
                inputMode="decimal"
                className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-brand-500 focus:outline-none"
              />
              <button type="button" aria-label="More" onClick={() => set({ doseValue: (Number(m.doseValue) || 0) + (Number(m.doseValue) >= 1 ? 1 : 0.25), quantity: undefined })} className="rounded-md border border-slate-300 p-1.5 hover:bg-slate-50">
                <Plus className="h-3 w-3" />
              </button>
              <span className="ml-1 text-sm font-normal text-slate-700">{m.doseUnit}</span>
            </div>
          </div>
          <label className="text-xs font-medium text-slate-600">
            Route
            <select
              value={m.route?.code || ""}
              onChange={(e) => {
                const r = routeFor(e.target.value);
                set({ route: r ? { code: r.code, display: r.display } : undefined });
              }}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            >
              {ROUTES.map((r) => (
                <option key={r.code} value={r.code}>{r.short}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-600">How often</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {FREQUENCIES.map((f) => (
                <button key={f.code} type="button" title={f.hint} onClick={() => set({ frequency: f.code, pattern: undefined, asNeeded: f.code === "SOS", quantity: undefined })} className={chip(!m.pattern && m.frequency === f.code)}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {PATTERNS.map((p) => (
                <button key={p} type="button" title="Morning-Noon-Night" onClick={() => set({ pattern: p, frequency: undefined, quantity: undefined })} className={chip(m.pattern === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600">When</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {FOOD.map((f) => (
                <button key={f.code} type="button" onClick={() => set({ foodTiming: m.foodTiming === f.code ? undefined : f.code })} className={chip(m.foodTiming === f.code)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <p className="text-xs font-medium text-slate-600">For</p>
              <div className="mt-1 flex items-center gap-1.5">
                <input
                  value={m.durationValue ?? ""}
                  onChange={(e) => set({ durationValue: e.target.value === "" ? undefined : Number(e.target.value), quantity: undefined })}
                  inputMode="numeric"
                  className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-brand-500 focus:outline-none"
                />
                <select value={m.durationUnit || "d"} onChange={(e) => set({ durationUnit: e.target.value, quantity: undefined })} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none">
                  {DURATION_UNITS.map((u) => (
                    <option key={u.code} value={u.code}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-1">
              {[3, 5, 7, 10, 15, 30].map((d) => (
                <button key={d} type="button" onClick={() => set({ durationValue: d, durationUnit: "d", quantity: undefined })} className={chip(m.durationValue === d && (m.durationUnit || "d") === "d")}>
                  {d}d
                </button>
              ))}
            </div>
            <label className="text-xs font-medium text-slate-600">
              Qty
              <input
                value={qty ?? ""}
                onChange={(e) => set({ quantity: e.target.value === "" ? undefined : Number(e.target.value) })}
                placeholder={countable ? "auto" : "—"}
                inputMode="numeric"
                className="mt-1 block w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-brand-500 focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      <input
        value={m.instructions || ""}
        onChange={(e) => set({ instructions: e.target.value })}
        placeholder="Special instructions (optional) – e.g. dissolve in water, avoid driving"
        className="mt-3 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
      />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
        <Pill className="h-3.5 w-3.5 text-brand-500" />
        <span className="font-medium">{sigText(m) || "Choose how often and for how long"}</span>
        {qty ? <span className="text-slate-400">→ dispense {qty}</span> : null}
      </p>
    </div>
  );
};

const MedicationEditor = ({ items, onChange, locationId, allergies }) => {
  const add = (s) => onChange([...items, medicationFromSuggestion(s)]);
  const keyOf = (m) => m.medication.code || m.medication.display.toLowerCase();
  return (
    <div className="space-y-3">
      {items.map((m, i) => (
        <MedicationRow
          key={i}
          m={m}
          index={i}
          allergies={allergies}
          duplicate={items.findIndex((x) => keyOf(x) === keyOf(m) && (x.strength || "") === (m.strength || "")) !== i}
          onChange={(next) => onChange(items.map((x, j) => (j === i ? next : x)))}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
        />
      ))}
      <ConceptPicker
        type="medication"
        locationId={locationId}
        placeholder={items.length ? "Add another medicine…" : "Type a medicine or brand name (e.g. Dolo, Paracetamol, Azithromycin)"}
        onPick={add}
        renderMeta={(o) => (o.source === "favourite" ? `${o.uses}× · ${sigText(o.defaults)}` : o.stock !== undefined ? `${o.stock} in stock` : o.strengths?.join(", "))}
      />
    </div>
  );
};

export default MedicationEditor;
