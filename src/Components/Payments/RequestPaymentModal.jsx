import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Copy, RefreshCw, Send, Undo2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge, Button, Modal } from "../Common/ui";
import { paymentApi, rupees } from "../../util/paymentApi";

const COLORS = { sent: "brand", paid: "green", expired: "amber", cancelled: "slate" };
const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none";

/** Send a payment request for a visit, watch its status, or ask an admin for a refund. */
const RequestPaymentModal = ({ appointment, patientLabel, outstanding, onClose, onChanged }) => {
  const [rows, setRows] = useState([]);
  const [paid, setPaid] = useState([]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [refundFor, setRefundFor] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const load = useCallback(() => {
    paymentApi.requests(appointment._id).then(setRows).catch(() => {});
    paymentApi.payments(appointment._id).then(setPaid).catch(() => {});
  }, [appointment._id]);
  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // live status while the patient pays
    return () => clearInterval(t);
  }, [load]);

  const act = async (fn, msg) => {
    setBusy(true);
    try {
      await fn();
      if (msg) toast.success(msg);
      load();
      onChanged?.();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  const active = rows.find((r) => r.status === "sent");
  const changed = amount !== "" && Number(amount) !== outstanding;

  return (
    <Modal open onClose={onClose} title="Request payment" description={patientLabel} size="max-w-md" footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      {active ? (
        <div className="rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-600">Patient can scan to pay {rupees(active.amountPaise)}</p>
          <div className="mt-3 flex justify-center"><QRCodeSVG value={active.url} size={168} /></div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" icon={Copy} onClick={() => navigator.clipboard?.writeText(active.url).then(() => toast.success("Link copied"))}>Copy link</Button>
            <Button variant="secondary" icon={RefreshCw} disabled={busy} onClick={() => act(() => paymentApi.resend(active._id), "Request resent")}>Resend</Button>
            <Button variant="secondary" icon={X} disabled={busy} onClick={() => act(() => paymentApi.cancelRequest(active._id), "Request cancelled")}>Cancel</Button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Also shown as Pay now in the patient's portal and sent by e-mail.</p>
        </div>
      ) : outstanding > 0 ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Amount (₹)
            <input type="number" min="1" className={`${inputClass} mt-1`} placeholder={String(outstanding)} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          {changed && (
            <label className="block text-sm font-medium text-slate-700">Reason for changing the amount
              <input className={`${inputClass} mt-1`} value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>
          )}
          <Button icon={Send} loading={busy} className="w-full" onClick={() => act(() => paymentApi.createRequest({ appointmentId: appointment._id, ...(changed ? { amount: Number(amount), reason } : {}) }), "Payment request sent")}>Send request</Button>
        </div>
      ) : (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Nothing is outstanding on this visit.</p>
      )}
      {rows.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {rows.map((r) => (
            <li key={r._id} className="flex items-center justify-between text-sm"><span>{rupees(r.amountPaise)}</span><Badge color={COLORS[r.status]}>{r.status}</Badge></li>
          ))}
        </ul>
      )}
      {paid.filter((p) => ["paid", "partially_refunded"].includes(p.status)).length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-sm font-semibold text-slate-800">Payments</p>
          {paid.filter((p) => ["paid", "partially_refunded"].includes(p.status)).map((p) => (
            <div key={p._id} className="mt-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{rupees(p.amountPaise)} · {p.method}</span>
                <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700" onClick={() => setRefundFor(p)}><Undo2 className="h-3.5 w-3.5" /> Request refund</button>
              </div>
              {refundFor?._id === p._id && (
                <div className="mt-2 flex gap-2">
                  <input className={inputClass} placeholder="Reason, for your hospital admin" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
                  <Button disabled={busy} onClick={() => act(() => paymentApi.refund({ paymentId: p._id, reason: refundReason }), "Sent to your hospital admin").then(() => setRefundFor(null))}>Send</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default RequestPaymentModal;
