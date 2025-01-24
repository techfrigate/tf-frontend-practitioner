import React, { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import CustomButton from "../Common/CustomButton";
import CustomSelect from "../Common/CustomSelect";
import CustomInput from "../Common/CustomInput";
import { searchIllness } from "../../Store/fhirSlice";
import { useDispatch } from "react-redux";
import Loader from "../Common/Loader";
import axios from "axios";
import FHIRFormComponent from "./FHIRFormComponent";
import {DiagnosisData} from "../../util/prescriptionData";
 
const formatDate = (date) => new Date(date).toISOString();
const createDiagnosisResource = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "Condition",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/StructureDefinition/Condition"],
    },
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: formData.clinicalStatus,
          display:
            formData.clinicalStatus.charAt(0).toUpperCase() +
            formData.clinicalStatus.slice(1),
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
          code: formData.verificationStatus,
          display:
            formData.verificationStatus.charAt(0).toUpperCase() +
            formData.verificationStatus.slice(1),
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
            code: formData.category,
            display: formData.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          },
        ],
      },
    ],
    severity: formData.severity
      ? {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: {
                mild: "255604002",
                moderate: "6736007",
                severe: "24484000",
              }[formData.severity],
              display:
                formData.severity.charAt(0).toUpperCase() +
                formData.severity.slice(1),
            },
          ],
        }
      : undefined,
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: formData.diagnosisCode,
          display: formData.diagnosis,
        },
      ],
    },
    bodySite: formData.bodySite
      ? [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: formData.bodySiteCode,
                display: formData.bodySite,
              },
            ],
          },
        ]
      : undefined,
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4",
    },
    onsetDateTime: formData.onsetDateTime || undefined,
    abatementDateTime: formData.abatementDateTime || undefined,
    recordedDate: formData.recordedDate || undefined,
    note: formData.note
      ? [
          {
            text: formData.note,
          },
        ]
      : undefined,
  };

  return JSON.parse(JSON.stringify(resource));
};

const Diagnosis = ({closeSheet}) => {
  const initialFormState = {
    diagnosis: "",
    diagnosisCode: "",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    category: "problem-list-item",
    severity: "",
    bodySite: "",
    bodySiteCode: "",
    onsetDateTime: "",
    abatementDateTime: "",
    recordedDate: new Date().toISOString().slice(0, 16),
    note: "",
  };

  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const diagnosisResource = createDiagnosisResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      { ...diagnosisResource, tenantId: "6721a71bba60e77ed113c3b8" }
    );
    alert("Diagnosis recorded successfully!");
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };

  return (
    <FHIRFormComponent
      closeSheet={closeSheet}
      formFields={DiagnosisData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Procedure"
      initialFormState={initialFormState}
    />
  );
};

export default Diagnosis;
