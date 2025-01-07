import React, { useEffect } from "react";
import { FaUserMd, FaVideo } from "react-icons/fa";

const ConsultationType = ({
  consultationType,
  handleConsultationChange,
  selectedDoctor,
}) => {
  useEffect(() => {
    if (selectedDoctor && selectedDoctor.slots) {
      const hasBoth = selectedDoctor.slots.some(
        (slot) => slot.visitType === "Both"
      );
      if (hasBoth && consultationType !== "Offline") {
        handleConsultationChange("Online");
      }
    }
  }, []);

  return (
    <div className="mt-5 w-full">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Consultation Type
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {/* In-person Consultation */}
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
            ₹{selectedDoctor.slots[0]?.practitionerData?.inPersonFees || "0"}
          </p>
        </div>

        {/* Online Consultation */}
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
            ₹{selectedDoctor.slots[0]?.practitionerData?.onlineFees || "0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationType;
