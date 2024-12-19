import React from "react";
import { Search, User, Phone, Mail, Calendar } from "lucide-react";
import { Input } from "../../Components/ui/input";

const PatientSearch = ({
  searchQuery,
  setSearchQuery,
  patients,
  onSelect,
  selectedPatient,
}) => {
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
      ? patients
      : patients.filter((patient) => {
          const searchLower = searchQuery.toLowerCase();
          const fullName =
            `${patient.firstName} ${patient.lastName}`.toLowerCase();
          const phone = patient.phoneNumber?.value || "";
          const email = patient.email?.toLowerCase() || "";

          return (
            fullName.includes(searchLower) ||
            phone.includes(searchLower) ||
            email.includes(searchLower)
          );
        });

  return (
    <div className="w-full space-y-4 space-x-2">
      {!selectedPatient ? (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search patients by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[22rem] truncate border border-gray-500"
            />
          </div>

          {searchQuery && (
            <div
              className={`absolute w-[22rem] max-h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform ${
                filteredPatients.length > 0
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                overflow: 'auto',
                scrollbarWidth: 'none', /* Hide scrollbar for Firefox */
                msOverflowStyle: 'none', /* Hide scrollbar for IE and Edge */
              }}
            >
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="cursor-pointer p-3 border-b border-gray-300 hover:bg-gray-100"
                  onClick={() => onSelect(patient)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
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
              ))}

              {filteredPatients.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No patients found matching your search
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="relative flex items-center ">
          <Input
            type="text"
            value={`${selectedPatient.firstName} ${selectedPatient.lastName} - Age: ${calculateAge(
              selectedPatient.dob
            )}`}
            readOnly
            onClick={() => onSelect(null)}
            className="w-[21rem] cursor-pointer border truncate border-green-500 bg-green-50 text-green-800 font-semibold"
          />
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
