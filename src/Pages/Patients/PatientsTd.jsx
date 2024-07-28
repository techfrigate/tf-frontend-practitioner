import React from "react";
import { useDispatch } from "react-redux";
import { setPatientData } from "../../Store/patientSlice";
import { data } from "./PatientsData";
import { useNavigate } from "react-router-dom";

const PatientsTd = ({ offset, itemsPerPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateToPatient = (patient) => {
    dispatch(setPatientData(patient));
    navigate("/newPatients");
  };

  return (
    <>
      {data.slice(offset, offset + itemsPerPage).map((item) => {
        const maskedPhone = `******${item.phone.slice(-4)}`;

        return (
          <tr
            key={item.id}
            className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
            onClick={() => navigateToPatient(item)}
          >
            <td className="py-4 px-4 text-nowrap text-xs">
              <div className="flex gap-2 items-center">
                <p className="bg-[#1e817e] w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-sm">
                  {item.shortName}
                </p>
                <div className="flex flex-col">
                  <p>{item.patients}</p>
                  <p className="text-gray-500">{item.gender}</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4 text-nowrap text-xs">{item.UHID}</td>
            <td className="py-4 px-4 text-nowrap text-xs">
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-900">
                {item.status}
              </span>
            </td>
            <td className="py-4 px-4 text-nowrap text-xs">{item.lastVisit}</td>
            <td className="py-4 px-4 text-nowrap text-xs">{item.DOB}</td>
            <td className="py-4 px-4 text-nowrap text-xs">{maskedPhone}</td>
          </tr>
        );
      })}
    </>
  );
};

export default PatientsTd;
