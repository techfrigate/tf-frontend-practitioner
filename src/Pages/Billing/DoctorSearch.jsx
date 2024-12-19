import React,{useEffect,useState} from "react";
import { Search } from "lucide-react";
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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search doctors by name or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[22rem] truncate border border-gray-500"
            />
          </div>

          {searchQuery && (
            <div
              className={`absolute w-[22rem] max-h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform ${
                filteredDoctors.length > 0
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                overflow: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none', 
              }}
            >
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="cursor-pointer p-3 border-b border-gray-300 hover:bg-gray-100"
                  onClick={() => onSelect(doctor)}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-xs text-gray-600 ">
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
        <div className="relative flex items-center ">
          <Input
            type="text"
            value={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName} - ${selectedDoctor.work?.speciality || "General Practitioner"}`}
            readOnly
            onClick={() => onSelect(null)}
            className="w-[21rem] cursor-pointer border truncate border-green-500 bg-green-50 text-green-800 font-semibold"
          />
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
