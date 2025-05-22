import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import FHIRFormComponent from "./FHIRFormComponent";
import { searchIllness } from "../../Store/fhirSlice";
import {MedicalHistoryData} from "../../util/prescriptionData";
 import toast from "react-hot-toast";
 
const formatDate = (date) => new Date(date).toISOString();
const createConditionResource = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "Condition",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/Condition"]
    },
    clinicalStatus: {
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
        code: formData.clinicalStatus,
        display: formData.clinicalStatus.charAt(0).toUpperCase() + formData.clinicalStatus.slice(1)
      }]
    },
    verificationStatus: {
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        code: formData.verificationStatus,
        display: formData.verificationStatus.charAt(0).toUpperCase() + formData.verificationStatus.slice(1)
      }]
    },
    severity: formData.severity ? {
      coding: [{
        system: "http://snomed.info/sct",
        code: formData.severity,
        display: formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1)
      }]
    } : undefined,
    code: {
      coding: [{
        system: "http://snomed.info/sct",
        code: formData.conditionCode,
        display: formData.condition
      }]
    },
    bodySite: formData.bodySite ? [{
      coding: [{
        system: "http://snomed.info/sct",
        code: formData.bodySiteCode,
        display: formData.bodySite
      }]
    }] : undefined,
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4"
    },
    onsetDateTime: formatDate(formData.onsetDateTime),
    abatementDateTime: formatDate(formData.abatementDateTime),
    recordedDate: formatDate(formData.recordedDate),
    note: formData.note ? [{
      text: formData.note
    }] : undefined
  };

  return JSON.parse(JSON.stringify(resource));
};

const MedicalHistory = ({closeSheet}) => {
  const initialFormState = {
    condition: "",
    conditionCode: "",
    clinicalStatus: "",
    verificationStatus: "",
    severity: "",
    onsetDateTime: "",
    abatementDateTime: "",
    recordedDate: "",
    bodySite: "",
    bodySiteCode: "",
    note: ""
  };

  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const conditionResource = createConditionResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      {
        ...conditionResource,
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
      formFields={MedicalHistoryData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Medical History"
      initialFormState={initialFormState}
    />
  );
};

export default MedicalHistory