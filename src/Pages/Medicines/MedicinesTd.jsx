import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";

const MedicinesTd = () => {
  const navigate = useNavigate();
  const { medicines } = useSelector((state) => state.Medicines);

  const navigateToBill = (id) => {
    navigate(`/add-medicine?mid=${id}`);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <>
      {medicines?.map((item) => (
        <tr
          key={item._id}
          
          className={`hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer relative group`}
        >
          <td className="py-3 w-[15%] px-6 font-medium">
            {item.pharmacyName}
            <div className="text-xs text-gray-600 mt-1">{item.rackName}</div>
          </td>
          <td className="py-4 px-6 font-medium">{item.locationName}</td>
          <td className="py-4 px-6 font-medium">{item.medicineName}</td>
          <td className="py-4 px-6 font-medium">{item.manufacturedBy}</td>
          <td className="py-4 px-6 text-[13px] font-medium">
            {formatDateTime(item.expiryDate)}
          </td>
          <td className="py-4 px-6 text-[13px]">{item.mrpPerUnit}/Unit</td>
          <td className="py-4 px-6 text-[13px]">
            <span
              className={`${
                Number(item.unit) <= Number(item.minQuantity)
                  ? 'text-white bg-red-600 px-3 py-2 rounded-xl font-medium'
                  : 'text-black bg-transparent'
              }`}
            >
              {item.unit}
            </span>
          </td>

          <style jsx>{`
            tr:hover {
              z-index: 20;
            }

            tr:hover ~ tr {
              filter: blur(1.5px);
              transition: filter 0.3s ease-in-out;
            }
          `}</style>
{item.unit <= item.minQuantity && (
  <div className="absolute invisible group-hover:visible bg-red-500 text-white px-3 py-1.5 text-sm rounded shadow-lg -top-10 left-1/2 transform -translate-x-1/2 w-64 z-50">
    Low stock warning: Units below or at minimum quantity
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
  </div>
)}
<td className="flex flex-flow-col gap-6 text-xl text-[#64c6b0] py-5 px-7 text-[13px]">
                <div
                  className="hover:bg-gray-300 rounded-full p-2"
                  onClick={() => navigateToBill(item._id)}
                >
                  <MdModeEdit />
                </div>
              </td>
        </tr>
      ))}
    </>
  );
};

export default MedicinesTd;