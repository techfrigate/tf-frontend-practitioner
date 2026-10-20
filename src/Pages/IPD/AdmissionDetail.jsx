import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { differenceInCalendarDays, format } from "date-fns";
import {
  ArrowLeftRight, BedDouble, ChevronLeft, FilePlus2, FileText, HeartPulse, IndianRupee, LogOut, Phone, Pill, Plus, Printer, Receipt, Stethoscope, Trash2, Wallet,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Modal, Spinner, inputClass } from "../../Components/Common/ui";
import { ADMISSION_TYPES, DISCHARGE_CONDITIONS, PAYMENT_METHODS, ageSex, fullName, inr, ipdApi } from "../../util/ipdApi";
import { AdmissionStatus, BedPicker, WARD_TYPE_COLOR } from "./common";
import { STATUS_BADGE, rxApi } from "../../util/prescriptionApi";

const TABS = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "notes", label: "Notes & vitals", icon: HeartPulse },
  { key: "rx", label: "Prescriptions", icon: Pill },
  { key: "bill", label: "Charges & bill", icon: Receipt },
  { key: "discharge", label: "Discharge", icon: LogOut },
];

const CHARGE_TYPES = [
  { value: "service", label: "Service", catalog: true },
  { value: "diagnostics", label: "Lab / diagnostic", catalog: true },
  { value: "medicines", label: "Medicine (from pharmacy)", catalog: true },
  { value: "package", label: "Package", catalog: true },
  { value: "consultation", label: "Doctor visit / consultation" },
  { value: "procedure", label: "Procedure / OT" },
  { value: "nursing", label: "Nursing / care" },
  { value: "other", label: "Other" },
];
const CATEGORY_LABEL = { bed: "Bed", ...Object.fromEntries(CHARGE_TYPES.map((c) => [c.value, c.label.split(" (")[0]])) };

const fmt = (d) => (d ? format(new Date(d), "d MMM yyyy, h:mm a") : "—");

// ------------------------------------------------------------------ modals

const ChargeModal = ({ open, onClose, admission, onSaved }) => {
  const [type, setType] = useState("service");
  const [catalog, setCatalog] = useState(null);
  const [itemId, setItemId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [gst, setGst] = useState("0");
  const [qty, setQty] = useState("1");
  const [saving, setSaving] = useState(false);
  const isCatalog = CHARGE_TYPES.find((c) => c.value === type)?.catalog;

  useEffect(() => {
    if (!open) return;
    setType("service");
    setItemId("");
    setName("");
    setPrice("");
    setGst("0");
    setQty("1");
    ipdApi.catalog(admission._id).then(setCatalog).catch((e) => toast.error(e.message));
  }, [open, admission._id]);

  useEffect(() => {
    setItemId("");
    if (type === "consultation") {
      setName("Doctor visit");
      setPrice(String(admission.doctor?.fee || ""));
    } else if (!isCatalog) {
      setName("");
      setPrice("");
    }
  }, [type, isCatalog, admission.doctor?.fee]);

  const items = (catalog && catalog[type]) || [];
  const item = items.find((i) => String(i._id) === itemId);
  const unit = isCatalog ? item?.price || 0 : Number(price) || 0;
  const rate = isCatalog ? item?.gstPercentage || 0 : Number(gst) || 0;
  const amount = unit * (Number(qty) || 0);

  const save = async () => {
    if (isCatalog && !item) return toast.error("Choose an item.");
    if (!isCatalog && !name.trim()) return toast.error("Enter what the charge is for.");
    if (!(Number(qty) > 0)) return toast.error("Quantity must be more than zero.");
    if (item?.stock !== undefined && Number(qty) > item.stock) return toast.error(`Only ${item.stock} in stock.`);
    setSaving(true);
    try {
      const updated = await ipdApi.addCharge(admission._id, {
        category: type,
        itemId: isCatalog ? itemId : undefined,
        name: isCatalog ? undefined : name.trim(),
        unitPrice: isCatalog ? undefined : Number(price),
        gstPercentage: isCatalog ? undefined : Number(gst) || 0,
        quantity: Number(qty),
      });
      toast.success("Charge added");
      onSaved(updated);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add charge"
      description="Charges are added to the running IPD bill. Bed charges are calculated automatically."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={save}>Add {amount ? inr(amount * (1 + rate / 100)) : "charge"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {CHARGE_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        {isCatalog ? (
          <Field label="Item" hint={!catalog ? "Loading…" : !items.length ? "Nothing set up for this location yet." : undefined}>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className={inputClass}>
              <option value="">Select…</option>
              {items.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name} – {inr(i.price)}
                  {i.stock !== undefined ? ` (${i.stock} in stock)` : ""}
                  {i.gstPercentage ? ` + ${i.gstPercentage}% GST` : ""}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Field label="Description">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dressing, IV cannulation, Physiotherapy" className={inputClass} />
              </Field>
            </div>
            <Field label="Unit price (₹)">
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
            </Field>
            <Field label="GST %">
              <input type="number" min="0" value={gst} onChange={(e) => setGst(e.target.value)} className={inputClass} />
            </Field>
          </div>
        )}
        <Field label={type === "medicines" ? "Quantity (units)" : "Quantity"}>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={`${inputClass} sm:w-40`} />
        </Field>
      </div>
    </Modal>
  );
};

const DepositModal = ({ open, onClose, admission, onSaved }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) {
      setAmount(admission.bill.balance > 0 ? String(admission.bill.balance) : "");
      setMethod("cash");
      setReference("");
    }
  }, [open, admission.bill.balance]);

  const save = async () => {
    if (!(Number(amount) > 0)) return toast.error("Enter an amount.");
    setSaving(true);
    try {
      onSaved(await ipdApi.addDeposit(admission._id, { amount: Number(amount), method, reference: reference.trim() || undefined }));
      toast.success(`${inr(amount)} received`);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Collect payment"
      description={`Running bill ${inr(admission.bill.total)} · received ${inr(admission.bill.deposits)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={save}>Record payment</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Amount (₹)">
          <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Method">
          <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Reference / receipt no. (optional)">
            <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>
    </Modal>
  );
};

const TransferModal = ({ open, onClose, admission, onSaved }) => {
  const [bed, setBed] = useState(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) {
      setBed(null);
      setReason("");
    }
  }, [open]);

  const save = async () => {
    if (!bed) return toast.error("Pick the new bed.");
    setSaving(true);
    try {
      onSaved(await ipdApi.transfer(admission._id, { bed, reason: reason.trim() || undefined }));
      toast.success(`Moved to ${bed.label}`);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="max-w-3xl"
      title="Transfer to another bed"
      description={`Currently in ${admission.currentBed?.wardName} · Bed ${admission.currentBed?.bedNumber}. The old bed goes to cleaning.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={saving} icon={ArrowLeftRight} onClick={save}>Transfer{bed ? ` to ${bed.label}` : ""}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <BedPicker locationId={admission.locationId} value={bed} onChange={setBed} excludeBedId={admission.currentBed?.bedId} />
        <Field label="Reason (optional)">
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Needs ICU monitoring" className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
};

// ------------------------------------------------------------------ tabs

const Overview = ({ a }) => {
  const latestVitals = [...(a.notesLog || [])].reverse().find((n) => n.vitals);
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-slate-900">Admission</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {[
            ["Reason / provisional diagnosis", a.reason],
            ["Admission type", ADMISSION_TYPES.find((t) => t.value === a.admissionType)?.label],
            ["Admitted on", fmt(a.admittedAt)],
            ["Attending doctor", `Dr. ${fullName(a.doctor)}${a.doctor?.speciality ? ` (${a.doctor.speciality})` : ""}`],
            ["Attendant", [a.attendantName, a.attendantPhone].filter(Boolean).join(" · ") || "—"],
            ["Notes", a.notes || "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-slate-500">{k}</dt>
              <dd className="mt-0.5 text-slate-900">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900">Latest vitals</h3>
        {latestVitals ? (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["BP", latestVitals.vitals.bp, "mmHg"],
                ["Pulse", latestVitals.vitals.pulse, "/min"],
                ["Temp", latestVitals.vitals.temperature, "°F"],
                ["SpO₂", latestVitals.vitals.spo2, "%"],
              ].map(([k, v, u]) => (
                <div key={k} className="rounded-lg bg-slate-50 p-2.5">
                  <p className="text-[11px] text-slate-500">{k}</p>
                  <p className="text-sm font-semibold text-slate-900">{v ?? "—"} {v !== undefined && v !== null && <span className="text-xs font-normal text-slate-500">{u}</span>}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">{fmt(latestVitals.at)}</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No vitals recorded yet.</p>
        )}
      </Card>
      <Card className="p-5 lg:col-span-3">
        <h3 className="text-sm font-semibold text-slate-900">Bed history</h3>
        <ol className="mt-3 space-y-3">
          {a.bedStays.map((s, i) => (
            <li key={s._id || i} className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${!s.to && a.status === "admitted" ? "bg-emerald-500" : "bg-slate-300"}`} />
              <div className="text-sm">
                <p className="font-medium text-slate-900">
                  {s.wardName} · Bed {s.bedNumber} <span className="font-normal text-slate-500">({s.buildingName}, floor {s.floorLevel})</span>
                </p>
                <p className="text-xs text-slate-500">
                  {fmt(s.from)} → {s.to ? fmt(s.to) : "now"} · {inr(s.dailyRate)}/day
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
};

const Notes = ({ a, onSaved }) => {
  const open = a.status === "admitted";
  const [type, setType] = useState("progress");
  const [text, setText] = useState("");
  const [v, setV] = useState({ bp: "", pulse: "", temperature: "", spo2: "", respiratoryRate: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const vitals = Object.fromEntries(Object.entries(v).filter(([, x]) => String(x).trim() !== ""));
    if (!text.trim() && !Object.keys(vitals).length) return toast.error("Write a note or record a vital.");
    setSaving(true);
    try {
      onSaved(await ipdApi.addNote(a._id, { type: Object.keys(vitals).length && !text.trim() ? "vitals" : type, text: text.trim(), vitals }));
      setText("");
      setV({ bp: "", pulse: "", temperature: "", spo2: "", respiratoryRate: "" });
      toast.success("Saved to the chart");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const log = [...(a.notesLog || [])].reverse();
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      {open && (
        <Card className="p-5 lg:self-start">
          <h3 className="text-sm font-semibold text-slate-900">Add to chart</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["progress", "Doctor's note"],
              ["nursing", "Nursing note"],
              ["order", "Order / instruction"],
            ].map(([k, l]) => (
              <button key={k} type="button" onClick={() => setType(k)} className={`rounded-full px-3 py-1 text-xs font-medium ${type === k ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                {l}
              </button>
            ))}
          </div>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Findings, plan, instructions…" className={`${inputClass} mt-3`} />
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">Vitals (optional)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              ["bp", "BP (120/80)"],
              ["pulse", "Pulse /min"],
              ["temperature", "Temp °F"],
              ["spo2", "SpO₂ %"],
              ["respiratoryRate", "Resp. rate"],
            ].map(([k, ph]) => (
              <input key={k} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} placeholder={ph} inputMode={k === "bp" ? "text" : "decimal"} className={inputClass} />
            ))}
          </div>
          <Button className="mt-4 w-full" loading={saving} onClick={save}>Save</Button>
        </Card>
      )}
      <Card className={`p-5 ${open ? "" : "lg:col-span-2"}`}>
        <h3 className="text-sm font-semibold text-slate-900">Clinical timeline</h3>
        {!log.length ? (
          <p className="mt-3 text-sm text-slate-500">Nothing charted yet.</p>
        ) : (
          <ol className="mt-4 space-y-4 border-l border-slate-200 pl-4">
            {log.map((n, i) => (
              <li key={n._id || i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-400 ring-4 ring-white" />
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Badge color={n.type === "vitals" ? "red" : n.type === "nursing" ? "care" : n.type === "order" ? "amber" : "brand"}>
                    {{ progress: "Doctor", nursing: "Nursing", vitals: "Vitals", order: "Order" }[n.type] || n.type}
                  </Badge>
                  <span>{fmt(n.at)}</span>
                  {n.authorName && <span>· {n.authorName}</span>}
                </div>
                {n.text && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{n.text}</p>}
                {n.vitals && (
                  <p className="mt-1 text-sm text-slate-700">
                    {[
                      n.vitals.bp && `BP ${n.vitals.bp}`,
                      n.vitals.pulse && `Pulse ${n.vitals.pulse}`,
                      n.vitals.temperature && `Temp ${n.vitals.temperature}°F`,
                      n.vitals.spo2 && `SpO₂ ${n.vitals.spo2}%`,
                      n.vitals.respiratoryRate && `RR ${n.vitals.respiratoryRate}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
};

const Bill = ({ a, onSaved, onAddCharge, onDeposit }) => {
  const open = a.status === "admitted";
  const navigate = useNavigate();
  const b = a.bill;
  const remove = async (line) => {
    if (!window.confirm(`Remove "${line.name}" from the bill?${line.category === "medicines" ? " The medicine goes back to stock." : ""}`)) return;
    try {
      onSaved(await ipdApi.removeCharge(a._id, line._id));
      toast.success("Charge removed");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-900">{open ? "Running bill" : "Final bill"}</h3>
          {open && <Button icon={Plus} onClick={onAddCharge}>Add charge</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-2.5">Item</th>
                <th className="px-3 py-2.5 text-right">Qty</th>
                <th className="px-3 py-2.5 text-right">Rate</th>
                <th className="px-3 py-2.5 text-right">GST</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
                {open && <th className="w-10" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b.lines.map((l, i) => (
                <tr key={l._id || `bed-${i}`}>
                  <td className="px-5 py-2.5">
                    <p className="text-slate-900">{l.name}</p>
                    <p className="text-xs text-slate-500">
                      {CATEGORY_LABEL[l.category] || l.category}
                      {l.category === "bed" ? ` · ${l.quantity} day${l.quantity > 1 ? "s" : ""}` : l.chargedAt ? ` · ${format(new Date(l.chargedAt), "d MMM")}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-700">{l.quantity}</td>
                  <td className="px-3 py-2.5 text-right text-slate-700">{inr(l.unitPrice)}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{l.gst ? `${inr(l.gst)} (${l.gstPercentage}%)` : "—"}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-slate-900">{inr(l.amount)}</td>
                  {open && (
                    <td className="pr-3 text-right">
                      {l.category !== "bed" && (
                        <button type="button" onClick={() => remove(l)} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {open && <p className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-500">Bed charges grow each day and are finalised at discharge.</p>}
      </Card>

      <div className="space-y-5">
        <Card className="p-5">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{inr(b.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">GST</dt><dd>{inr(b.gst)}</dd></div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold"><dt>Total</dt><dd>{inr(b.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Paid / advance</dt><dd className="text-emerald-600">− {inr(b.deposits)}</dd></div>
            <div className={`flex justify-between text-base font-semibold ${b.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              <dt>{b.balance > 0 ? "Balance due" : "Advance remaining"}</dt>
              <dd>{inr(Math.abs(b.balance))}</dd>
            </div>
          </dl>
          {open ? (
            <Button variant="secondary" className="mt-4 w-full" icon={Wallet} onClick={onDeposit}>Collect payment</Button>
          ) : (
            a.billingId && (
              <Button variant="secondary" className="mt-4 w-full" icon={Receipt} onClick={() => navigate(`/add-bill?id=${a.billingId}`)}>
                Open bill {a.billId}
              </Button>
            )
          )}
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">Payments</h3>
          {!a.deposits?.length ? (
            <p className="mt-2 text-sm text-slate-500">No payments yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {a.deposits.map((d, i) => (
                <li key={d._id || i} className="flex justify-between py-2">
                  <span>
                    <span className="block text-slate-900">{PAYMENT_METHODS.find((m) => m.value === d.method)?.label || d.method}</span>
                    <span className="block text-xs text-slate-500">{fmt(d.at)}{d.reference ? ` · ${d.reference}` : ""}</span>
                  </span>
                  <span className="font-medium text-slate-900">{inr(d.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

const Discharge = ({ a, onSaved }) => {
  const navigate = useNavigate();
  const [condition, setCondition] = useState("recovered");
  const [summary, setSummary] = useState("");
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [pay, setPay] = useState("");
  const [method, setMethod] = useState("cash");
  const [saving, setSaving] = useState(false);
  const b = a.bill;

  useEffect(() => {
    setPay(b.balance > 0 ? String(b.balance) : "");
  }, [b.balance]);

  if (a.status !== "admitted") {
    return (
      <Card className="p-6 print:shadow-none" id="discharge-summary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Discharge summary</h3>
            <p className="text-sm text-slate-500">{a.admissionNumber} · discharged {fmt(a.dischargedAt)}</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
            {a.billingId && <Button icon={Receipt} onClick={() => navigate(`/add-bill?id=${a.billingId}`)}>Open bill</Button>}
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {[
            ["Patient", `${fullName(a.patient)} (${ageSex(a.patient)})`],
            ["Attending doctor", `Dr. ${fullName(a.doctor)}`],
            ["Admitted", fmt(a.admittedAt)],
            ["Discharged", fmt(a.dischargedAt)],
            ["Length of stay", `${b.lengthOfStayDays} day(s)`],
            ["Condition at discharge", DISCHARGE_CONDITIONS.find((c) => c.value === a.dischargeCondition)?.label],
            ["Reason for admission", a.reason],
            ["Follow-up", a.followUpDate ? format(new Date(a.followUpDate), "d MMM yyyy") : "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-slate-500">{k}</dt>
              <dd className="mt-0.5 text-slate-900">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <p className="text-xs text-slate-500">Summary</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{a.dischargeSummary}</p>
        </div>
        {a.dischargeAdvice && (
          <div className="mt-4">
            <p className="text-xs text-slate-500">Advice / medication on discharge</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{a.dischargeAdvice}</p>
          </div>
        )}
      </Card>
    );
  }

  const submit = async () => {
    if (!summary.trim()) return toast.error("Write the discharge summary.");
    if (pay && !(Number(pay) >= 0)) return toast.error("Enter a valid payment amount.");
    if (!window.confirm(`Discharge ${fullName(a.patient)} now? The final bill will be generated and the bed sent for cleaning.`)) return;
    setSaving(true);
    try {
      const updated = await ipdApi.discharge(a._id, {
        condition,
        summary: summary.trim(),
        advice: advice.trim() || undefined,
        followUpDate: followUpDate || undefined,
        finalPayment: Number(pay) > 0 ? { amount: Number(pay), method } : undefined,
      });
      toast.success(`Discharged · bill ${updated.billId}`);
      onSaved(updated);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
    <div className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-brand-900">
        <b>Medicines to take home?</b> Write the discharge prescription first – it is coded with SNOMED CT, added to the discharge summary and shown in the patient's app.
      </p>
      <Button icon={Pill} onClick={() => navigate(`/prescriptions/write?admissionId=${a._id}&kind=discharge`)}>Discharge prescription</Button>
    </div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="space-y-4 p-5">
        <Field label="Condition at discharge">
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
            {DISCHARGE_CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Discharge summary" hint="Course in hospital, investigations, treatment given, final diagnosis.">
          <textarea rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Advice / medication on discharge">
          <textarea rows={3} value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Medicines, diet, activity, warning signs…" className={inputClass} />
        </Field>
        <Field label="Follow-up date (optional)">
          <input type="date" value={followUpDate} min={format(new Date(), "yyyy-MM-dd")} onChange={(e) => setFollowUpDate(e.target.value)} className={`${inputClass} sm:w-56`} />
        </Field>
      </Card>
      <Card className="p-5 lg:self-start">
        <h3 className="text-sm font-semibold text-slate-900">Final settlement</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-slate-500">Bill total (to date)</dt><dd className="font-medium">{inr(b.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Paid / advance</dt><dd>{inr(b.deposits)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Balance</dt><dd className={b.balance > 0 ? "text-rose-600" : "text-emerald-600"}>{inr(b.balance)}</dd></div>
        </dl>
        {b.balance > 0 && (
          <div className="mt-4 space-y-3">
            <Field label="Collect now (₹)" hint="Leave less than the balance to discharge with dues.">
              <input type="number" min="0" max={b.balance} value={pay} onChange={(e) => setPay(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Method">
              <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </Field>
          </div>
        )}
        {b.balance < 0 && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">{inr(-b.balance)} of the advance is unused. Refund it to the patient at the counter.</p>}
        <Button variant="danger" className="mt-5 w-full" icon={LogOut} loading={saving} onClick={submit}>Discharge & generate bill</Button>
      </Card>
    </div>
    </div>
  );
};

const Prescriptions = ({ a }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  useEffect(() => {
    rxApi.list({ admissionId: a._id }).then(setRows).catch(() => setRows([]));
  }, [a._id]);
  const open = a.status === "admitted";
  const write = (kind) => navigate(`/prescriptions/write?admissionId=${a._id}&kind=${kind}`);
  const hasDischargeRx = rows?.some((r) => r.kind === "discharge" && r.status === "final");

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Inpatient prescriptions</h3>
          <p className="text-sm text-slate-500">
            Medication orders during the stay, and the discharge prescription the patient takes home. Signed prescriptions appear in the patient's app.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {open && <Button icon={FilePlus2} onClick={() => write("inpatient-order")}>Write medication order</Button>}
          <Button variant={open ? "secondary" : "primary"} icon={LogOut} onClick={() => write("discharge")}>
            {hasDischargeRx ? "New discharge prescription" : "Discharge prescription"}
          </Button>
        </div>
      </Card>
      <Card className="overflow-hidden">
        {!rows ? (
          <Spinner />
        ) : !rows.length ? (
          <EmptyState icon={Pill} title="No prescriptions yet" description={open ? "Write the first medication order for this admission." : "Write the discharge prescription."} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((r) => (
              <li key={r._id}>
                <button
                  type="button"
                  onClick={() => navigate(r.status === "draft" ? `/prescriptions/write?admissionId=${a._id}&kind=${r.kind}` : `/prescriptions/${r._id}`)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-3 text-left hover:bg-slate-50"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-900">
                      {r.kind === "discharge" ? "Discharge prescription" : "Medication order"} · {r.prescriptionNumber}
                      <Badge color={STATUS_BADGE[r.status]?.color}>{STATUS_BADGE[r.status]?.label}</Badge>
                    </span>
                    <span className="block truncate text-sm text-slate-600">{r.medications.join(", ") || "No medicines"}</span>
                    <span className="block text-xs text-slate-500">{fmt(r.signedAt || r.encounterDate)} · {r.signedByName || "Draft"}</span>
                  </span>
                  <FileText className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

// ------------------------------------------------------------------ page

const AdmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [a, setA] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    ipdApi.get(id).then(setA).catch((e) => setError(e.message));
  }, [id]);
  useEffect(load, [load]);

  const days = useMemo(() => (a ? a.bill.lengthOfStayDays : 0), [a]);

  if (error) return <Card><EmptyState icon={BedDouble} title="Couldn't open this admission" description={error} action={<Button variant="secondary" onClick={() => navigate("/ipd/admissions")}>Back to admissions</Button>} /></Card>;
  if (!a) return <Spinner />;
  const open = a.status === "admitted";

  return (
    <div className="space-y-5">
      <button type="button" onClick={() => navigate("/ipd/admissions")} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 print:hidden">
        <ChevronLeft className="h-4 w-4" /> Admissions
      </button>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{fullName(a.patient)}</h1>
              <span className="text-sm text-slate-500">{ageSex(a.patient)}</span>
              <AdmissionStatus status={a.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="font-mono text-xs">{a.admissionNumber}</span>
              {a.patient?.uhid && <span>UHID {a.patient.uhid}</span>}
              {a.patient?.phoneNumber?.value && (
                <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{a.patient.phoneNumber.dialCode} {a.patient.phoneNumber.value}</span>
              )}
              <span className="inline-flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" />Dr. {fullName(a.doctor)}</span>
            </div>
          </div>
          {open && (
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button variant="secondary" icon={Plus} onClick={() => setModal("charge")}>Add charge</Button>
              <Button variant="secondary" icon={IndianRupee} onClick={() => setModal("deposit")}>Collect payment</Button>
              <Button variant="secondary" icon={ArrowLeftRight} onClick={() => setModal("transfer")}>Transfer bed</Button>
              <Button variant="danger" icon={LogOut} onClick={() => setTab("discharge")}>Discharge</Button>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">{open ? "Current bed" : "Last bed"}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-900">
              {(a.currentBed || a.bedStays[a.bedStays.length - 1])?.wardName} · Bed {(a.currentBed || a.bedStays[a.bedStays.length - 1])?.bedNumber}
              <Badge color={WARD_TYPE_COLOR[(a.currentBed || a.bedStays[a.bedStays.length - 1])?.wardType] || "slate"}>{(a.currentBed || a.bedStays[a.bedStays.length - 1])?.wardType}</Badge>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Admitted</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">{format(new Date(a.admittedAt), "d MMM, h:mm a")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Length of stay</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">
              {open ? `Day ${Math.max(1, differenceInCalendarDays(new Date(), new Date(a.admittedAt)) + 1)}` : `${days} day(s)`}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{open ? "Running bill" : "Final bill"}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">
              {inr(a.bill.total)}{" "}
              <span className={`text-xs ${a.bill.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                ({a.bill.balance > 0 ? `${inr(a.bill.balance)} due` : a.bill.balance < 0 ? `${inr(-a.bill.balance)} advance left` : "settled"})
              </span>
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 print:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === t.key ? "border-brand-500 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview a={a} />}
      {tab === "notes" && <Notes a={a} onSaved={setA} />}
      {tab === "rx" && <Prescriptions a={a} />}
      {tab === "bill" && <Bill a={a} onSaved={setA} onAddCharge={() => setModal("charge")} onDeposit={() => setModal("deposit")} />}
      {tab === "discharge" && <Discharge a={a} onSaved={setA} />}

      {open && (
        <>
          <ChargeModal open={modal === "charge"} onClose={() => setModal(null)} admission={a} onSaved={(x) => { setA(x); setTab("bill"); }} />
          <DepositModal open={modal === "deposit"} onClose={() => setModal(null)} admission={a} onSaved={setA} />
          <TransferModal open={modal === "transfer"} onClose={() => setModal(null)} admission={a} onSaved={setA} />
        </>
      )}
    </div>
  );
};

export default AdmissionDetail;
