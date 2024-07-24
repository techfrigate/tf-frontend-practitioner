import React, { useState } from "react";
import {
  addressInfo,
  emergencyContactInfo,
  personalInfoFormData,
} from "./NewpatientFormData";
import PersonalInfo from "./PersonalInfo";
import EmergencyContactInfo from "./EmergencyContactInfo";
import AddressInfo from "./AddressInfo";
import FileUpload from "./FileUpload";
const CreateNewPatients = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="p-4 max-h-full px-3 customScrollbar">
      <FileUpload file={file} setFile={setFile} />
      {personalInfoFormData?.map((ele, index) => (
        <PersonalInfo ele={ele} index={index} />
      ))}

      {emergencyContactInfo?.map((ele, index) => (
        <EmergencyContactInfo ele={ele} index={index} />
      ))}

      {addressInfo?.map((ele, index) => (
        <AddressInfo ele={ele} index={index} />
      ))}
      <div className="flex justify-center gap-2 mt-4">
        <button className="px-4 pb-2 pt-1.5 text-[14px] border border-[#1e817e] hover:bg-[#239591] hover:text-white rounded">
          Cancel
        </button>
        <button className="px-4 pb-2 pt-1.5 text-[14px] bg-[#1e817e] text-white hover:bg-[#166866]  transition duration-300 ease-in-out rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateNewPatients;
