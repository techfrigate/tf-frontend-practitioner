import React,{useEffect} from "react";

const ConsultationType = ({ consultationType, handleConsultationChange, selectedDoctor }) => {

  useEffect(() => {
    if (selectedDoctor && selectedDoctor.slots) {
      const hasBoth = selectedDoctor.slots.some((slot) => slot.visitType === "Both");
      if (hasBoth && consultationType !== "Offline") {
        handleConsultationChange("Online");
      }
    }
  }, []);

  return (
    <div className="mt-8 w-full max-w-md bg-white rounded-lg p-10 shadow-md">
      <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">
        Consultation Type
      </h2>
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => handleConsultationChange("Offline")}
          className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
            consultationType === "Offline"
              ? "bg-[#00A182] text-white border-[#00A182]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          In-person
        </button>
        <button
          onClick={() => handleConsultationChange("Online")}
          className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
            consultationType === "Online"
              ? "bg-[#00A182] text-white border-[#00A182]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Online
        </button>
      </div>
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-gray-600 text-base font-medium">
          Price: ₹
          {consultationType === "Offline"
            ? selectedDoctor.slots[0]?.practitionerData?.inPersonFees
            : selectedDoctor.slots[0]?.practitionerData?.onlineFees}
        </p>
      </div>
    </div>
  );
};

export default ConsultationType;
