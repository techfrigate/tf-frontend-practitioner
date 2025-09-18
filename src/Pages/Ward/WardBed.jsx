import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useEffect, useState } from "react";
import { bookBed, fetchAllBookedBeds } from "../../Store/wardSlice";
import { fetchPatients } from "../../Store/patientSlice";
import { Bed as BedIcon, Search, Phone, Calendar } from "lucide-react";

const WardBed = ({ bed, onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { patients = [] } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 50 }));
  }, [dispatch]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeDisplay = (dob) => `${calculateAge(dob)} years`;

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleBedClick = () => {
    if (bed.status !== "booked") {
      setShowDropdown((prev) => !prev);
      onClick(bed);
    }
  };

  const handlePatientSelect = (patient) => {
    const userData = {
      bedStatus: "booked",
      bedId: bed._id,
      patientId: patient._id,
    };

    dispatch(bookBed({ bedId: bed._id, userData })).then(() => {
      dispatch(fetchAllBookedBeds());
    });
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-28 h-32 border rounded-lg transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer
          ${bed.status === "booked" ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-200"}`}
        onClick={handleBedClick}
      >
        <div className="flex flex-col h-full p-1.5">
          <div className="flex items-center justify-between mb-1">
            <BedIcon
              className={`${bed.status === "booked" ? "text-red-500" : "text-blue-500"}`}
              size={12}
            />
            <span
              className={`font-bold text-xs ${
                bed.status === "booked" ? "text-red-600" : "text-blue-500"
              }`}
            >
              #{bed.number}
            </span>
          </div>

          <div className="flex justify-center mb-1">
            <span
              className={`text-[10px] font-semibold px-1 py-0.5 rounded-full tracking-wide ${
                bed.status === "booked"
                  ? "text-red-700 bg-red-200 border border-red-300"
                  : "text-green-700 bg-green-200 border border-green-300"
              }`}
            >
              {bed.status === "booked" ? "BOOKED" : "AVAILABLE"}
            </span>
          </div>

          {bed.status === "booked" && bed.patient ? (
            <div className="bg-white rounded-md p-1 shadow-sm border border-red-100 text-xs flex flex-col flex-grow">
              <p className="font-bold text-red-700 text-center truncate text-[10px]">
                {bed.patient.firstName} {bed.patient.lastName}
              </p>
              <div className="flex justify-center pt-1 pb-1 ">
                <span className="text-[10px] text-gray-500">Age:</span>
                <span className="font-bold text-gray-600 px-1 text-[10px]">
                  {bed.patient.age || (bed.patient.dob ? calculateAge(bed.patient.dob) : "-")}
                </span>
              </div>
              <div className="flex items-center justify-center bg-red-50 rounded-md p-0.5 ">
                <Phone size={8} className="text-red-600 mr-0.5 " />
                <span className="font-mono text-[10px] text-red-700 truncate ">
                  {bed.patient.phone?.mobile ||
                  (bed.patient.phone?.dialCode && bed.patient.phone?.value
                    ? `${bed.patient.phone.dialCode}${bed.patient.phone.value}`
                    : bed.patient.phoneNumber
                    ? typeof bed.patient.phoneNumber === "object"
                      ? `${bed.patient.phoneNumber.dialCode} ${bed.patient.phoneNumber.value}`
                      : bed.patient.phoneNumber
                    : "-")}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow">
              <span className="text-xl mb-2">🛏️</span>
              <p className="text-blue-700 font-medium text-[12px]">Ready for patient</p>
            </div>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute z-50 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <div className="relative mb-2">
            <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-56 overflow-y-auto scrollbar-hide">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <button
                  key={patient._id}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 flex flex-col gap-1 border-b last:border-none"
                  onClick={() => {
                    handlePatientSelect(patient);
                    setShowDropdown(false);
                  }}
                >
                  <div className="font-medium text-gray-800">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-1">
                    <Phone size={12} />{" "}
                    {typeof patient.phoneNumber === "object"
                      ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
                      : patient.phoneNumber}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-1">
                    <Calendar size={12} /> Age: {getAgeDisplay(patient.dob)}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WardBed;
