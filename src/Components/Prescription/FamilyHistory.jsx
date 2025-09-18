import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import FHIRFormComponent from "./FHIRFormComponent";
import { searchIllness } from "../../Store/fhirSlice";
import {FamilyHistoryData} from "../../util/prescriptionData";
import toast from "react-hot-toast";

const formatDate = (date) => new Date(date).toISOString();
const createFamilyHistoryResource = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "FamilyMemberHistory",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/FamilyMemberHistory"]
    },
    status: formData.status,
    patient: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4"
    },
    date: formatDate(formData.date),
    relationship: {
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
        code: formData.relationship,
        display: FamilyHistoryData.find(f => f.name === 'relationship')?.options.find(o => o.value === formData.relationship)?.label
      }]
    },
    condition: [{
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: formData.conditionCode,
          display: formData.condition
        }]
      }
    }],
    note: formData.note ? [{
      text: formData.note
    }] : undefined
  };

  return JSON.parse(JSON.stringify(resource));
};

const FamilyHistory = ({closeSheet}) => {
  const initialFormState = {
    status: "",
    relationship: "",
    date: "",
    condition: "",
    conditionCode: "",
    note: ""
  };

  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const familyHistoryResource = createFamilyHistoryResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      {
        ...familyHistoryResource,
        tenantId: "6721a71bba60e77ed113c3b8"
      }
    );
    toast.success("Resource created successfully!");
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };


  return (
    <FHIRFormComponent
          closeSheet={closeSheet}
      formFields={FamilyHistoryData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Medical History"
      initialFormState={initialFormState}
    />
  );
};

export default FamilyHistory;