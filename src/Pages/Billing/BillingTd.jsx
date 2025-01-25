import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const BillingTd = () => {
  const navigate = useNavigate();
  const {billings } = useSelector((state) => state.billing);
  const navigateToBill = (id) => {
    navigate(`/AddBill?id=${id}`);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      {billings?.map((item) => (
        <tr
          key={item._id}
          onClick={() => navigateToBill(item._id)}
          className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer "
        >
          <td className="py-3 w-[27%] px-6 font-medium ">
            {item.patientName}
            <div className="text-xs text-gray-600 mt-1">
            {item.locationName}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {item.phoneNumber.dialCode} {item.phoneNumber.value}
            </div>
          </td>
          <td className="py-4 px-6 ">
            {item.uhid}
          </td>
          <td className="py-4 px-6">{item.billId}</td>
          <td className="py-4 px-6">
            <span
              className={`inline-flex items-center rounded-md border px-2.5  py-0.5 text-xs font-semibold ${
                item.status === false
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {item.status === false ? "Due" : "Paid"}
            </span>
          </td>
          <td className="py-4 px-6 text-[13px] font-medium">
            {formatDateTime(item.updatedAt)}
          </td>
          <td className="py-4 px-6 text-[13px]">₹ {item.totalAmount}</td>
          <style jsx>{`
            tr:hover {
              z-index: 10;
            }
            tr:hover ~ tr {
              filter: blur(1.5px);
              transition: filter 0.3s ease-in-out;
            }
          `}</style>
        </tr>
      ))}
    </>
  );
};

export default BillingTd;
