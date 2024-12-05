import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Loading from "../../components/Common/Loading";

const PatientsTd = () => {
  const navigate = useNavigate();

  const navigateToPatient = (patientId) => {
    navigate(`/newPatients?id=${patientId}`);
  };

  const { patients, status } = useSelector((state) => state.patient);

  if (status === "loading") {
    return <Loading size="16" color="teal-500" className="h-screen" />;
  }

  return (
    <>
      {patients.length > 0 && patients.map((item) => {
          const maskedPhone = `${item.phoneNumber.value}`;
          const formattedDob = format(new Date(item.dob), "MMM dd, yyyy");
          const formattedUpdatedAt = format(new Date(item.updatedAt), "MMM dd, yyyy");

          return (
            <tr
              key={item._id}
              className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
              onClick={() => navigateToPatient(item._id)}
            >
              <td className="py-4 px-4 text-nowrap text-xs">
                <div className="flex gap-2 items-center">
                  <p className="bg-[#1e817e] w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[12px]">
                    {`${item.firstName[0]}${item.lastName[0]}`}
                  </p>
                  <div className="flex flex-col">
                    <p>{`${item.firstName} ${item.lastName}`}</p>
                    <p className="text-gray-500">{item.gender}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">9999999999</td>
              <td className="py-4 px-4 text-nowrap text-xs">
                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-900">
                  Active
                </span>
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{formattedDob}</td>
              <td className="py-4 px-4 text-nowrap text-xs">{formattedUpdatedAt}</td>
              <td className="py-4 px-4 text-nowrap text-xs">{maskedPhone}</td>
            </tr>
          );
        })}
    </>
  );
};

export default PatientsTd;
