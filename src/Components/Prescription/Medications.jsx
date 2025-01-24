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
import {MedicationData} from "../../util/prescriptionData";
// Field configurations
 
const formatDate = (date) => new Date(date).toISOString();
const createMedicationRequest = (formData) => {
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "MedicationRequest",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/StructureDefinition/MedicationRequest"],
    },
    status: formData.status,
    intent: formData.intent,
    priority: formData.priority,
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: formData.medicationCode,
          display: formData.medication,
        },
      ],
    },
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4", // Replace with actual patient reference
    },
    authoredOn: formData.authoredOn,
    requester: {
      reference: "Practitioner/example", // Replace with actual practitioner reference
    },
    dosageInstruction: [
      {
        text: formData.dosageInstructions,
        timing: {
          code: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/timing-abbreviation",
                code: formData.frequency,
                display: formData.frequency,
              },
            ],
          },
        },
        route: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "26643006",
              display: formData.route,
            },
          ],
        },
        doseAndRate: [
          {
            doseQuantity: {
              value: parseFloat(formData.doseAmount),
              unit: formData.doseUnit,
              system: "http://unitsofmeasure.org",
              code: formData.doseUnit,
            },
          },
        ],
      },
    ],
    dispenseRequest: formData.quantity
      ? {
          numberOfRepeatsAllowed: parseInt(formData.refills) || 0,
          quantity: {
            value: parseInt(formData.quantity),
            unit: formData.doseUnit,
            system: "http://unitsofmeasure.org",
            code: formData.doseUnit,
          },
          expectedSupplyDuration: {
            value: parseInt(formData.duration),
            unit: "days",
            system: "http://unitsofmeasure.org",
            code: "d",
          },
        }
      : undefined,
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

const Medication = ({closeSheet}) => {
  const initialFormState = {
    medication: "",
    medicationCode: "",
    status: "active",
    intent: "order",
    priority: "routine",
    route: "oral",
    doseAmount: "",
    doseUnit: "mg",
    frequency: "daily",
    quantity: "",
    refills: "0",
    duration: "30",
    authoredOn: new Date().toISOString().slice(0, 16),
    dosageInstructions: "",
    note: "",
  };
 
  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const medicationResource = createMedicationRequest(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      { ...medicationResource, tenantId: "6721a71bba60e77ed113c3b8" }
    );
    alert("Medication prescribed successfully!");
  };

  const searchCallback = async (term, ecl) => {
    const response = await dispatch(searchIllness({ term, ecl }));
    return response.payload;
  };

   
  
  return (
    <FHIRFormComponent
          closeSheet={closeSheet}
      formFields={MedicationData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="MedicationRequest"
      initialFormState={initialFormState}
    />
  );
};

export default Medication;
