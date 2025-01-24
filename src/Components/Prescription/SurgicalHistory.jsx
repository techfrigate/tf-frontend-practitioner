import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import FHIRFormComponent from "./FHIRFormComponent";
import { searchIllness } from "../../Store/fhirSlice";
import {SurgicalHistoryData} from "../../util/prescriptionData";

const formatDate = (date) => new Date(date).toISOString();

const createProcedureResource = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "Procedure",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/Procedure"]
    },
    status: formData.status,
    code: {
      coding: [{
        system: "http://snomed.info/sct",
        code: formData.procedureCode,
        display: formData.procedure
      }]
    },
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4"
    },
    performedDateTime: formatDate(formData.performedDateTime),
    recordedDate: formatDate(formData.recordedDate),
    verificationStatus: {
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        code: formData.verificationStatus,
        display: formData.verificationStatus.charAt(0).toUpperCase() + formData.verificationStatus.slice(1)
      }]
    },
    bodySite: formData.bodySite ? [{
      coding: [{
        system: "http://snomed.info/sct",
        code: formData.bodySiteCode,
        display: formData.bodySite
      }]
    }] : undefined,
    note: formData.note ? [{
      text: formData.note
    }] : undefined
  };

  return JSON.parse(JSON.stringify(resource));
};

const SurgicalHistory = ({closeSheet}) => {
  const initialFormState = {
    procedure: "",
    procedureCode: "",
    status: "",
    verificationStatus: "",
    performedDateTime: "",
    recordedDate: "",
    bodySite: "",
    bodySiteCode: "",
    note: ""
  };

  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const procedureResource = createProcedureResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      {
        ...procedureResource,
        tenantId: "6721a71bba60e77ed113c3b8"
      }
    );
    alert("Resource created successfully!");
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };

  return (
    <FHIRFormComponent
          closeSheet={closeSheet}
      formFields={SurgicalHistoryData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Surgical History"
      initialFormState={initialFormState}
    />
  );
};

export default SurgicalHistory;