import React from "react";
import { searchIllness } from "../../Store/fhirSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import FHIRFormComponent from "./FHIRFormComponent";
import {AllergenData} from "../../util/prescriptionData";
import toast from "react-hot-toast";
const formatDate = (date) => new Date(date).toISOString();

const createAllergyResource = (formData) => {
  // Get current ISO datetime for meta.lastUpdated
  const currentDateTime = new Date().toISOString();

  const resource = {
    resourceType: "AllergyIntolerance",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/AllergyIntolerance"],
    },
    // Required fields
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: formData.allergenCode,
          display: formData.allergen,
        },
      ],
    },
    patient: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4", // You'll need to replace this with actual patient reference
    },
    // Optional fields based on form data
    clinicalStatus: formData.clinicalStatus
      ? {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: formData.clinicalStatus,
              display:
                formData.clinicalStatus.charAt(0).toUpperCase() +
                formData.clinicalStatus.slice(1),
            },
          ],
        }
      : undefined,

    verificationStatus: formData.verificationStatus
      ? {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: formData.verificationStatus,
              display:
                formData.verificationStatus.charAt(0).toUpperCase() +
                formData.verificationStatus.slice(1),
            },
          ],
        }
      : undefined,

    category: formData.category ? [formData.category] : undefined,

    criticality: formData.criticality || undefined,

    onsetDateTime: formatDate(formData.onsetDateTime) || undefined,

    recordedDate: formatDate(formData.recordedDate) || undefined,

    lastOccurrence: formatDate(formData.lastOccurrence) || undefined,

    note: formData.note
      ? [
          {
            text: formData.note,
          },
        ]
      : undefined,

    reaction: formData.reactionManifestation
      ? [
          {
            manifestation: [
              {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: formData.reactionManifestationCode,
                    display: formData.reactionManifestation,
                  },
                ],
              },
            ],
            substance: formData.reactionSubstance
              ? {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: formData.reactionSubstanceCode,
                      display: formData.reactionSubstance,
                    },
                  ],
                }
              : undefined,
            exposureRoute: formData.reactionExposureRoute
              ? {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: formData.reactionExposureRouteCode,
                      display: formData.reactionExposureRoute,
                    },
                  ],
                }
              : undefined,
            severity: formData.reactionSeverity || undefined,
          },
        ]
      : undefined,
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(resource));
};

const AllergyIntolerance = ({closeSheet}) => {
  const initialFormState = {
    allergen: "",
    allergenCode: "",
    clinicalStatus: "",
    reactionManifestation: "",
    reactionManifestationCode: "",
    reactionSubstance: "",
    reactionSubstanceCode: "",
    reactionExposureRoute: "",
    reactionExposureRouteCode: "",
    reactionSeverity: "",
    criticality: "",
    category: "",
    verificationStatus: "",
    onsetDateTime: "",
    recordedDate: "",
    lastOccurrence: "",
    note: "",
  };
  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  const dispatch = useDispatch();
  const handleSubmit = async (formData) => {
    console.log("Form data: in ", formData);
    const allergyResource = createAllergyResource(formData);
    const response = await axios.post(
      `${FHIR_BASE_URL}/fhir-core/create-resource`,
      {
        ...allergyResource,
        tenantId: "6721a71bba60e77ed113c3b8",
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
      formFields={AllergenData}
      onSubmit={handleSubmit}
      searchCallback={searchCallback}
      resourceType="Allergy Intolerance"
      initialFormState={initialFormState}
    />
  );
};

export default AllergyIntolerance;
