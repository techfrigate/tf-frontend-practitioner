import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePatient, setPatientData } from "../../../Store/patientSlice";
import {
  addressInfo,
  emergencyContactInfo,
  personalInfoFormData,
} from "./NewpatientFormData";
import PersonalInfo from "./PersonalInfo";
// import EmergencyContactInfo from "./EmergencyContactInfo";
import AddressInfo from "./AddressInfo";
import FileUpload from "./FileUpload";

const CreateNewPatients = () => {
  const [file, setFile] = useState(null);
  // eslint-disable-next-line
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();

  const {
    patient: patientData = {},
    status,
    error,
  } = useSelector((state) => state.patient);

  // console.log("Patient Data:", patientData);

  const { patient } = useSelector((state) => state.patient);
  console.log(patient, "patient Data");

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    const {
      personalInfo = {},
      emergencyContact = {},
      address = {},
    } = patientData;

    personalInfoFormData.forEach((ele) => {
      if (!personalInfo[ele.id]) {
        newErrors[ele.id] = "This field is required";
        isValid = false;
      }
    });

    emergencyContactInfo.forEach((ele) => {
      if (!emergencyContact[ele.id]) {
        newErrors[ele.id] = "This field is required";
        isValid = false;
      }
    });

    addressInfo.forEach((ele) => {
      if (!address[ele.id]) {
        newErrors[ele.id] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = useCallback(() => {
    setSaved(true);
    if (validateInputs()) {
      const dataToSave = { ...patientData, file };
      console.log("Saving data:", dataToSave);
      dispatch(savePatient(dataToSave));
    }
    // eslint-disable-next-line
  }, [dispatch, patientData, file]);

  const handleInputChange = useCallback(
    (section, data) => {
      console.log(`Dispatching data for ${section}:`, data);
      dispatch(setPatientData({ [section]: data }));
    },
    [dispatch]
  );

  const handleInputFocus = useCallback((id) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  }, []);

  return (
    <div className="p-4 max-h-full px-3 customScrollbar">
      <FileUpload file={file} setFile={setFile} />
      {personalInfoFormData.map((ele, index) => (
        <PersonalInfo
          key={index}
          ele={ele}
          index={index}
          setPersonalInfo={(data) => handleInputChange("personalInfo", data)}
          saved={saved}
        />
      ))}
      {/* {emergencyContactInfo.map((ele, index) => (
        <EmergencyContactInfo
          key={index}
          ele={ele}
          saved={saved}
          setEmergencyContact={(data) =>
            handleInputChange("emergencyContact", data)
          }
          onFocus={() => handleInputFocus(ele.id)}
        />
      ))} */}
      {addressInfo.map((ele, index) => (
        <AddressInfo
          key={index}
          ele={ele}
          saved={saved}
          setAddress={(data) => handleInputChange("address", data)}
          onFocus={() => handleInputFocus(ele.id)}
        />
      ))}
      <div className="flex justify-center gap-2 mt-4">
        <button className="px-4 pb-2 pt-1.5 text-[14px] border border-[#1e817e] hover:bg-[#239591] hover:text-white rounded">
          Cancel
        </button>
        <button
          className="px-4 pb-2 pt-1.5 text-[14px] bg-[#1e817e] text-white hover:bg-[#166866] transition duration-300 ease-in-out rounded"
          onClick={handleSave}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Saving..." : "Save"}
        </button>
      </div>
      {status === "failed" && (
        <div className="mt-4 text-red-500">Error: {error}</div>
      )}
    </div>
  );
};

export default CreateNewPatients;
