import React, { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import CustomButton from "../Common/CustomButton";
import CustomSelect from "../Common/CustomSelect";
import CustomInput from "../Common/CustomInput";
import { searchIllness } from "../../Store/fhirSlice";
import { useDispatch } from "react-redux";
import Loader from "../Common/Loader";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import FHIRFormComponent from "./FHIRFormComponent";
import {ProcedureData}  from "../../util/prescriptionData";
// Field configurations
 import toast from "react-hot-toast";
 
const formatDate = (date) => new Date(date).toISOString();
const createProcedureResource = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "Procedure",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/StructureDefinition/Procedure"],
    },
    status: formData.status || "completed",
    category: formData.category
      ? {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: formData.category,
              display: formData.categoryDisplay,
            },
          ],
        }
      : undefined,
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: formData.procedureCode,
          display: formData.procedure,
        },
      ],
    },
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4", // Replace with actual patient reference
    },
    performedDateTime: formData.performedDateTime,
    priority: formData.priority
      ? {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/procedure-priority",
              code: formData.priority,
              display:
                formData.priority.charAt(0).toUpperCase() +
                formData.priority.slice(1),
            },
          ],
        }
      : undefined,
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
    note: formData.note
      ? [
          {
            text: formData.note,
          },
        ]
      : undefined,
    outcome: formData.outcome
      ? {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "385669000",
              display: formData.outcome,
            },
          ],
        }
      : undefined,
  };

  return JSON.parse(JSON.stringify(resource));
};

const Procedure = ({closeSheet}) => {
  const initialFormState = {
    procedure: "",
    procedureCode: "",
    status: "completed",
    category: "",
    priority: "",
    bodySite: "",
    bodySiteCode: "",
    performedDateTime: "",
    note: "",
    outcome: "",
  };

  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const procedureResource = createProcedureResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      { ...procedureResource, tenantId: "6721a71bba60e77ed113c3b8" }
    );
    toast.success("Procedure recorded successfully!");
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };

  return (
    <FHIRFormComponent
          closeSheet={closeSheet}
     formFields={ProcedureData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Procedure"
      initialFormState={initialFormState}
    />
  );
};

export default Procedure;
