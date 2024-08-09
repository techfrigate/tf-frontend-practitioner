import React from "react";
import { FaSearch } from "react-icons/fa";

const DoctorSearch = ({ searchDoctor, handleDoctorSearch, filteredDoctors, handleDoctorSelect }) => {
  const convertExperience = (value) => {
    const rem = value % 12;
    const num = Math.floor(value / 12);
    return `${num}.${rem}`;
  };

  return (
    <div className="relative w-full">
      <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#00A182]" />
      <input
        type="text"
        placeholder="Search Doctor.."
        value={searchDoctor}
        onChange={handleDoctorSearch}
        className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A182] transition duration-300 ease-in-out"
      />
      {filteredDoctors.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
          {filteredDoctors.map((doctor) => (
            <li
              key={doctor.slots[0].id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              onClick={() => handleDoctorSelect(doctor)}
            >
              <div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ECZ28iBTpFlNtSadX7LKKBAcliGr1TXOiw&s"
                  alt={doctor.slots[0].practitionerData.firstName}
                  className="w-[50px] h-[50px] rounded-full mr-3"
                />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">
                  {doctor.slots[0].practitionerData.firstName} {doctor.slots[0].practitionerData.lastName}
                </p>
                <p className="text-gray-500 text-sm">
                  {doctor.slots[0].practitionerData.speciality}
                </p>
                <p className="text-gray-400 text-xs">
                  {convertExperience(doctor.slots[0].practitionerData.experience)} year experience
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorSearch;
