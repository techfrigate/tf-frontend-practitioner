import React from "react";
import { ArrowLeft, Video } from "lucide-react";
import GlobalForm from "../../Components/Common/GlobalForm";
import { useDispatch } from "react-redux";
import { addFormData, setFormData } from "../../../src/Store/prescriptionformDataSlice";
import createResource from "../../Store/fhirSlice";
import AllergyIntolerance from "../../Components/Prescription/AllergyIntolerance";
import ChiefComplaints from "../../Components/Prescription/ChiefComplaints";
import Procedure from "../../Components/Prescription/Procedure";
import FamilyHistory from "../../Components/Prescription/FamilyHistory";
import SurgicalHistory from "../../Components/Prescription/SurgicalHistory";
import MedicalHistory from "../../Components/Prescription/MedicalHistory";
import VitalSigns from "../../Components/Prescription/VitalSigns";
import Diagnosis from "../../Components/Prescription/Diagnosis";
import Medication from "../../Components/Prescription/Medications";
import { useSearchParams } from "react-router-dom";
import VideoConsultation from "./VideoConsultation";

const FillDetailsSheet = ({isDialogOpen,selectedCategory,closeSheet}) => {
  const dispatch = useDispatch();

  if (!isDialogOpen || !selectedCategory) return null;
 
  const renderResourceForm = {
    Allergies:<AllergyIntolerance closeSheet={closeSheet}/>,
    Vitals:<VitalSigns closeSheet={closeSheet} />,
    "Chief Complaints":<ChiefComplaints closeSheet={closeSheet} />,
    Procedures:<Procedure closeSheet={closeSheet}/>,
    Medications:<Medication closeSheet={closeSheet}/>,
    Diagnosis:<Diagnosis closeSheet={closeSheet}/>,
    "Family History":<FamilyHistory closeSheet={closeSheet}/>,
     "Surgical History":<SurgicalHistory closeSheet={closeSheet}/>,
    // "Medical History":<MedicalHistory closeSheet={closeSheet}/>
  }
  return (
    <div className="fixed h-screen  inset-0 z-50 flex justify-end  ">
    
      <div
        className="fixed inset-0 bg-black bg-opacity-10"
        onClick={closeSheet}
      ></div>
       <div className="bg-white w-full max-w-2xl h-full flex flex-col gap-6 p-4  shadow-lg transform transition-transform translate-x-0 ease-in-out duration-300">
       
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            <ArrowLeft
              size={20}
              className="text-gray-500 cursor-pointer"
              onClick={closeSheet}
            />
            <h2 className="text-lg font-semibold">{`Fill Details for ${selectedCategory?.name}`}</h2>
          </div>
          <button
            onClick={closeSheet}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {renderResourceForm[selectedCategory.name]}
      </div> 
    </div>
 
  );
};

export default FillDetailsSheet;
