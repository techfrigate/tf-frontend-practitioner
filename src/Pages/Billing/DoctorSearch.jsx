import React, { useEffect, useState } from "react";
import { Search, X, User } from "lucide-react";
import { Input } from "../../Components/ui/input";

const DoctorSearch = ({
  searchQuery,
  setSearchQuery,
  doctors,
  onSelect,
  selectedDoctor,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const filteredDoctors =
    searchQuery.trim() === ""
      ? doctors
      : doctors.filter(
          (doctor) =>
            `${doctor.firstName} ${doctor.lastName}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            doctor.work?.speciality
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full space-y-4 space-x-2">
      {!selectedDoctor ? (
        <>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search doctors by name or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[25rem] truncate border-2 border-gray-200 rounded-2xl focus:border-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 h-14 text-base shadow-sm"
            />
          </div>

          {searchQuery && (
            <div
              className={`absolute w-[24rem] max-h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-700 ease-out transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="cursor-pointer p-4 hover:bg-gray-50 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-0"
                  onClick={() => onSelect(doctor)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-indigo-50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 leading-snug line-clamp-2">
                        {doctor.work?.speciality || "General Practitioner"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No doctors found matching your search
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div
          className="flex items-center gap-3 p-1.5 bg-emerald-50 border-2 border-emerald-500 
            rounded-2xl w-full md:w-[25rem] group cursor-pointer transition-all duration-200
            hover:bg-emerald-100 shadow-sm"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <User className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-emerald-800 mb-0.5">
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </div>
            {/* <div className="text-sm text-emerald-600 truncate">
              {selectedDoctor.work?.speciality || "General Practitioner"}
            </div> */}
          </div>
          <div
            className="bg-emerald-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
              transition-all duration-200"
            onClick={() => onSelect(null)}
          >
            <X className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
