import React from "react";
import { FaSearch } from "react-icons/fa";

const PatientSearch = ({ searchPatient, handlePatientSearch, filteredPatients, handlePatientSelect }) => {
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  return (
    <div className="relative w-full">
      <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#00A182]" />
      <input
        type="text"
        placeholder="Search Patient.."
        value={searchPatient}
        onChange={handlePatientSearch}
        className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A182] transition duration-300 ease-in-out"
      />
      {filteredPatients.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
          {filteredPatients.map((patient) => (
            <li
              key={patient.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              onClick={() => handlePatientSelect(patient)}
            >
              <div className="flex items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ECZ28iBTpFlNtSadX7LKKBAcliGr1TXOiw&s"
                  alt={patient.firstName}
                  className="w-[50px] h-[50px] rounded-full mr-3"
                />
                <div>
                  <p className="text-gray-800 font-semibold">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Age: {calculateAge(patient.dob)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientSearch;
