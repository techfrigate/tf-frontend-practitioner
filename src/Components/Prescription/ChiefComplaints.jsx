import React from "react";
import FHIRFormComponent from "./FHIRFormComponent";
import { useDispatch } from "react-redux";
import { searchIllness } from "../../Store/fhirSlice";
import axios from "axios";
import {ChiefComplaintData} from "../../util/prescriptionData";

const formatDate = (date) => new Date(date).toISOString();
const ChiefComplaints = ({closeSheet}) => {
  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const initialFormState = {
    condition: "",
    conditionCode: "",
    severity: "",
    onsetDateTime: "",
    abatementDateTime: "",
    recordedDate: new Date().toISOString().slice(0, 16),
    clinicalStatus: "",
    verificationStatus: "",
    category: "",
    note: "",
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };

  const createComplaintResource = (data) => {
    return {
      resourceType: "Condition",
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ["http://hl7.org/fhir/StructureDefinition/Condition"],
      },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: data.clinicalStatus,
            display: data.clinicalStatus,
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: data.verificationStatus,
            display: data.verificationStatus,
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: data.category,
              display: "Encounter Diagnosis",
            },
          ],
        },
      ],
      severity: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: data.severity,
            display: data.severity,
          },
        ],
      },
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: data.conditionCode,
            display: data.condition,
          },
        ],
      },
      subject: {
        reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4",
      },
      onsetDateTime: data.onsetDateTime || undefined,
      abatementDateTime: data.abatementDateTime || undefined,
      recordedDate: data.recordedDate,
      note: data.note ? [{ text: data.note }] : undefined,
    };
  };

  const handleSubmit = async (formData) => {
    const resource = createComplaintResource(formData);

    await axios.post(`${FHIR_BASE_URL}/fhir-core/create-resource`, {
      ...resource,
      tenantId: "6721a71bba60e77ed113c3b8",
    });
  };

  return (
    <FHIRFormComponent
          closeSheet={closeSheet}
      formFields={ChiefComplaintData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Chief Complaint"
      initialFormState={initialFormState}
    />
  );
};

export default ChiefComplaints;
