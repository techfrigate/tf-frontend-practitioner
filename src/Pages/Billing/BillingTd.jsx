import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients } from "../../Store/patientSlice";
import { useSelector, useDispatch } from "react-redux";

const BillingTd = ({ offset, itemsPerPage }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 10 }));
  }, []);

  const navigateToBill = (id) => {
    navigate(`/AddBill?id=${id}`);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      {patients?.slice(offset, offset + itemsPerPage).map((item) => (
        <tr
          key={item._id}
          onClick={() => navigateToBill(item._id)}
          className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer "
        >
          <td className="py-3 w-[27%] px-6 font-medium ">
            {item.firstName}
            {item.lastName}
            <div className="text-xs text-gray-600 mt-1">
            {item.address.addressLine1}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {item.phoneNumber.dialCode} {item.phoneNumber.value}
            </div>
          </td>
          <td className="py-4 px-6 ">
            9999999999
          </td>

          <td className="py-4 px-6">{calculateAge(item.dob)}</td>
          <td className="py-4 px-6">
            <span
              className={`inline-flex items-center rounded-md border px-2.5  py-0.5 text-xs font-semibold ${
                item.status === false
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {item.status === false ? "Due" : "Complete"}
            </span>
          </td>
          <td className="py-4 px-6 text-[13px] font-medium">
            {formatDateTime(item.updatedAt)}
          </td>
          <td className="py-4 px-6 text-[13px]">₹ 10000</td>
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
