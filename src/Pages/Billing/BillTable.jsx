import React from "react";
import { Receipt, Trash2 } from "lucide-react";

const BillingTable = ({ bills, onDelete, totalAmount, billIdFromUrl }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#64C6B0]">
              <th className="px-6 py-4 text-sm font-semibold text-white text-left">Service Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-left">Service</th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-right">Rate</th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-right">Quantity</th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-right">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bills && bills.length > 0 ? (
              bills.map((bill, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{bill.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bill.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    ₹{bill.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">{bill.quantity}</td> 
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    ₹{bill.price * bill.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onDelete(index)}
                        disabled={Boolean(billIdFromUrl)}
                        className={`p-2 rounded-lg transition-all duration-200 group
                          ${billIdFromUrl 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                      >
                        <Trash2 className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">No services added yet</p>
                    <p className="text-xs mt-1">Add a service to see it listed here</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {bills && bills.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex justify-end items-center space-x-4">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="text-lg font-semibold text-gray-900">
              ₹{totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTable;