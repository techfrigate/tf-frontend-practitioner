import React from "react";
import { MdDelete } from "react-icons/md";

const BillTable = ({ bills, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border rounded-lg shadow-lg">
        <thead>
          <tr className="bg-[#64C6B0] text-white text-sm uppercase tracking-wider">
            <th className="border p-3 text-center">Service Type</th>
            <th className="border p-3 text-center">Service</th>
            <th className="border p-3 text-center">Rate</th>
            <th className="border p-3 text-center">Amount</th>
            <th className="border p-3 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr
              key={index}
              className="text-center bg-white hover:bg-gray-100 transition-colors"
            >
              <td className="border p-3">{bill.serviceType}</td>
              <td className="border p-3">{bill.name}</td>
              <td className="border p-3">₹ {bill.rate}</td>
              <td className="border p-3">₹ {bill.amount}</td>
              <td className="border p-2 flex items-center justify-center">
                <button
                  className="bg-red-500 hover:bg-red-600  text-white px-4 py-2 rounded-md flex items-center justify-center transition-transform transform hover:scale-105"
                  onClick={() => onDelete(index)}
                >
                  <MdDelete className="mr-1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;
