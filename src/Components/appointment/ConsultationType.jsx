import React, { useMemo } from "react";
import { FaUserMd, FaVideo } from "react-icons/fa";

const ConsultationType = ({ consultationType, handleConsultationChange, selectedDoctor }) => {
   
  const availableConsultationTypes = useMemo(() => {
    if (!selectedDoctor?.slots?.length) return [];

    const types = new Set(selectedDoctor.slots.map(slot => slot.visitType));

    if (types.has("Both")) return ["Online", "Offline"];
    return [...types]; 
  }, [selectedDoctor]);

  return (
    <div className="mt-5 w-full">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Consultation Type
      </h2>
      <div className="grid grid-cols-2 gap-4">
        
        {availableConsultationTypes.includes("Offline") && (
          <div
            onClick={() => handleConsultationChange("Offline")}
            className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              consultationType === "Offline"
                ? "bg-gray-200 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaUserMd className="text-sm text-gray-700" />
              <p className="text-gray-800 font-medium">In-person Consultation</p>
            </div>
            <p className="text-gray-800 font-medium">
              ₹{selectedDoctor.slots[0]?.practitionerData?.work.inPerson || "0"}
            </p>
          </div>
        )}

        
        {availableConsultationTypes.includes("Online") && (
          <div
            onClick={() => handleConsultationChange("Online")}
            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              consultationType === "Online"
                ? "bg-gray-200 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaVideo className="text-sm text-gray-700" />
              <p className="text-gray-800 font-medium">Online Consultation</p>
            </div>
            <p className="text-gray-800 font-medium">
              ₹{selectedDoctor.slots[0]?.practitionerData?.work.online || "0"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationType;
