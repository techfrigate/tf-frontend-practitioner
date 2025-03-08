import React, { useState, useEffect } from "react";
import { Search, UserSearch, Phone, Mail, Calendar, X } from "lucide-react";
import { Input } from "../../Components/ui/input";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearError } from "../../Store/patientSlice";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
const PatientSearch = ({
  searchQuery,
  setSearchQuery,
  onSelect,
  selectedPatient,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { patients, isLoading, error } = useSelector((state) => state.patient);
  const dispatch = useDispatch();
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
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
    return `${age} years`;
  };

  const filteredPatients =
    searchQuery.trim() === ""
      ? patients.filter((patient) => patient.tenants.find(tenant => tenant.status && tenant.tenantId === Cookies.get("TenantId") && tenant.userType === "patient"))
      : patients.filter((patient) => {
          const searchLower = searchQuery.toLowerCase();
          const fullName =
            `${patient.firstName} ${patient.lastName}`.toLowerCase();
          const phone = patient.phoneNumber?.value || "";
          const email = patient.email?.toLowerCase() || "";

          return (
            (fullName.includes(searchLower) ||
              phone.includes(searchLower) ||
              email.includes(searchLower))
          );
        });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".patient-search-container")) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
console.log(patients,"patinets")
  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => {
        dispatch(clearError());
      }, 2000);
    }
  });

  return (
    <div className="w-full space-y-4 space-x-2 patient-search-container">
      {!selectedPatient ? (
        <>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search active patients by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsVisible(true)}
              className="pl-10 w-full md:w-[25rem] truncate border-2 border-gray-200 rounded-2xl 
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 
                h-14 text-base shadow-sm"
            />
          </div>
          <div
            className={`absolute w-[25rem] max-h-[300px] bg-white border border-gray-300 rounded-lg 
              shadow-lg transition-all duration-700 ease-out transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            style={{
              overflow: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="cursor-pointer p-4 hover:bg-gray-50 transition-all duration-200 
                  first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-0"
                  onClick={() => {
                    onSelect(patient);
                    setIsVisible(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserSearch className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-sm">
                          {patient.firstName} {patient.lastName}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>
                            {patient.phoneNumber
                              ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
                              : "No phone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{patient.email || "No email"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Age: {calculateAge(patient.dob)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No active patients found matching your search
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className="flex items-center gap-3 p-1.5 bg-emerald-50 border-2 border-emerald-500 
            rounded-2xl w-full md:w-[26rem] group cursor-pointer transition-all duration-200
            hover:bg-emerald-100 shadow-sm"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <UserSearch className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-emerald-800 mb-0.5">
              {selectedPatient.firstName} {selectedPatient.lastName}
            </div>
          </div>
          <div
            className="bg-emerald-100 p-1.5 rounded-full opacity-0 group-hover:opacity-100 
              transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
          >
            <X className="h-4 w-4 text-emerald-600 flex-shrink-0 group-hover:rotate-180 transition-transform" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
