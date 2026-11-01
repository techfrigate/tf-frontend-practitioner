import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { IndianRupee } from "lucide-react";
import { Badge, Card, EmptyState, Spinner } from "../../Components/Common/ui";
import { paymentApi, rupees } from "../../util/paymentApi";

const Stat = ({ label, value, tone = "text-slate-900" }) => (
  <Card className="p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-xl font-semibold ${tone}`}>{value}</p></Card>
);
const COLORS = { draft: "slate", approved: "brand", paid: "green" };

/** Read only. The server returns this doctor's figures and nothing else. */
const MyEarnings = () => {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    paymentApi.earnings().then(setD).catch((e) => setError(e.message));
  }, []);
  if (error) return <Card className="m-6"><EmptyState title="Couldn't load your earnings" description={error} /></Card>;
  if (!d) return <Spinner />;
  return (
    <div className="space-y-5 p-5">
      <div><h1 className="text-xl font-semibold text-slate-900">My earnings</h1><p className="text-sm text-slate-500">Your share of consultations, as set by your hospital.</p></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Earned" value={rupees(d.grossPaise)} />
        <Stat label="Refund adjustments" value={rupees(d.adjustmentsPaise)} tone="text-rose-700" />
        <Stat label="Pending" value={rupees(d.pendingPaise)} tone="text-amber-700" />
        <Stat label="Paid to you" value={rupees(d.paidPaise)} tone="text-emerald-700" />
      </div>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-800">Statements</h2>
        {!d.statements.length ? <p className="mt-2 text-sm text-slate-500">No statements yet.</p> : (
          <div className="mt-2 overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Period to</th><th>Gross</th><th>Adjustments</th><th>TDS</th><th>Net</th><th>Status</th><th>Reference</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{d.statements.map((s) => (
              <tr key={s._id}><td className="py-2">{format(new Date(s.periodEnd), "d MMM yyyy")}</td><td>{rupees(s.grossPaise)}</td><td>{rupees(s.adjustmentsPaise)}</td><td>{rupees(s.tdsPaise)}</td><td className="font-semibold">{rupees(s.netPaise)}</td><td><Badge color={COLORS[s.status]}>{s.status}</Badge></td><td>{s.reference || "—"}</td></tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-800">Per consultation</h2>
        {!d.entries.length ? <EmptyState icon={IndianRupee} title="Nothing yet" description="Paid consultations appear here." /> : (
          <ul className="mt-2 divide-y divide-slate-100">{d.entries.map((e) => (
            <li key={e._id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 truncate">{e.patient || "Patient"} <span className="text-slate-400">· {format(new Date(e.at), "d MMM, h:mm a")}{e.isRefund ? " · refund" : ""}</span></span>
              <span className={e.amountPaise < 0 ? "font-medium text-rose-700" : "font-medium"}>{rupees(e.amountPaise)}</span>
            </li>
          ))}</ul>
        )}
      </Card>
    </div>
  );
};

export default MyEarnings;
