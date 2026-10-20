import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PAYMENT_STATE = {
  paid: { label: "Paid", className: "bg-green-100 text-green-900" },
  partial: { label: "Partially paid", className: "bg-amber-100 text-amber-900" },
  due: { label: "Due", className: "bg-blue-100 text-blue-900" },
};

// Amount the patient owes for the bill: items + GST + doctor fees.
const billTotal = (bill) => Number(bill.totalAmount || 0) + Number(bill.gst || 0) + Number(bill.doctorFees || 0);

const paymentState = (bill) => {
  if (bill.status) return "paid";
  return Number(bill.paidAmount) > 0 ? "partial" : "due";
};

const money = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const BillingTd = () => {
  const navigate = useNavigate();
  const { billings } = useSelector((state) => state.billing);
  const navigateToBill = (id) => {
    navigate(`/add-bill?id=${id}`);
  };
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  return (
    <>
      {billings.map((item) => (
        <tr
          key={item._id}
          onClick={() => navigateToBill(item._id)}
          className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
        >
          <td className="py-4 w-[15%] px-6 font-medium">
            {item.patientName}
            <div className="text-xs text-gray-600 mt-1">
              {item.phoneNumber.dialCode} {item.phoneNumber.value}
            </div>
          </td>
          <td className="py-4 px-6 text-left">{item.locationDisplayName}</td>
          <td className="py-4 px-6">{item.uhid}</td>
          <td className="py-4 px-6">
            {item.billId}
            <div className="mt-1">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${item.billType === "IPD" ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-600"}`}>
                {item.billType === "IPD" ? `IPD · ${item.admissionNumber || ""}` : "OPD"}
              </span>
            </div>
          </td>
          <td className="py-4 px-6">
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_STATE[paymentState(item)].className}`}
            >
              {PAYMENT_STATE[paymentState(item)].label}
            </span>
            {paymentState(item) !== "paid" && Number(item.dueAmount) > 0 && (
              <div className="mt-1 text-xs text-gray-600">₹ {money(item.dueAmount)} due</div>
            )}
          </td>
          <td className="py-4 px-6 text-[13px] font-medium">
            {formatDateTime(item.updatedAt)}
          </td>
          <td className="py-4 px-6 text-[13px]">₹ {money(billTotal(item))}</td>
        </tr>
      ))}
    </>
  );
};

export default BillingTd;
