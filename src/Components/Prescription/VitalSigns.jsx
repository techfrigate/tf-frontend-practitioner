import React, { useState } from "react";
import CustomButton from "../Common/CustomButton";
import CustomSelect from "../Common/CustomSelect";
import CustomInput from "../Common/CustomInput";
import axios from "axios";
import {VitalSignsData} from "../../util/prescriptionData";
import toast from "react-hot-toast";
const { vitalSignFields, statusOptions } = VitalSignsData;

const formatDate = (date) => new Date(date).toISOString();
const createVitalSignResource = (formData, vitalSign) => {
  const currentDateTime = new Date().toISOString();
  if (vitalSign.name === "bloodPressure") {
    return {
      resourceType: "Observation",
      meta: {
        lastUpdated: currentDateTime,
        profile: ["http://hl7.org/fhir/StructureDefinition/vitalsigns"]
      },
      status: formData.status || "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs"
        }]
      }],
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "85354-9",
          display: "Blood pressure panel"
        }]
      },
      subject: {
        reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4"
      },
      effectiveDateTime: formatDate(formData.effectiveDateTime),
      component: [
        {
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "8480-6",
              display: "Systolic blood pressure"
            }]
          },
          valueQuantity: {
            value: parseFloat(formData.systolic),
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          }
        },
        {
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "8462-4",
              display: "Diastolic blood pressure"
            }]
          },
          valueQuantity: {
            value: parseFloat(formData.diastolic),
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          }
        }
      ]
    };
  }

  return {
    resourceType: "Observation",
    meta: {
      lastUpdated: currentDateTime,
      profile: ["http://hl7.org/fhir/StructureDefinition/vitalsigns"]
    },
    status: formData.status || "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "vital-signs",
        display: "Vital Signs"
      }]
    }],
    code: {
      coding: [{
        system: vitalSign.system,
        code: vitalSign.code,
        display: vitalSign.display
      }]
    },
    subject: {
      reference: "Patient/01fbd394-47df-48d8-b4fb-a70a6c5be7c4"
    },
    effectiveDateTime: formatDate(formData.effectiveDateTime),
    valueQuantity: {
      value: parseFloat(formData[vitalSign.name]),
      unit: vitalSign.unit,
      system: "http://unitsofmeasure.org",
      code: vitalSign.unit
    }
  };
};

const VitalSigns = ({closeSheet}) => {
  const FHIR_BASE_URL = process.env.REACT_APP_FHIR_URL;
  
  const initialFormState = {
    status: "",
    effectiveDateTime: new Date().toISOString().slice(0, 16),
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const vitalSignRanges = {
    systolic: { min: 60, max: 250, required: true },
    diastolic: { min: 40, max: 150, required: true },
    heartRate: { min: 30, max: 250, required: true },
    temperature: { min: 35, max: 42, required: true },
    respiratoryRate: { min: 4, max: 60, required: true },
    oxygenSaturation: { min: 50, max: 100, required: true }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.effectiveDateTime) {
      newErrors.effectiveDateTime = "Date and time is required";
    }

    if(!formData.status){
      newErrors.status = "Status is required";
    }

   // Validate vital signs
   Object.entries(vitalSignRanges).forEach(([field, range]) => {
    const value = parseFloat(formData[field]);
    
    if (range.required && !formData[field]) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (formData[field] && (value < range.min || value > range.max)) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be between ${range.min} and ${range.max}`;
    }
  });
     

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
     
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const resources = vitalSignFields
      .map(field => {
        if (field.name === "bloodPressure") {
          if (formData.systolic && formData.diastolic) {
            return createVitalSignResource(formData, field);
          }
        } else if (formData[field.name]) {
          return createVitalSignResource(formData, field);
        }
        return null;
      })
      .filter(Boolean);  

      await Promise.all(
        resources.map(resource =>
          axios.post(`${FHIR_BASE_URL}/fhir-core/create-resource`, {
            ...resource,
            tenantId:"6721a71bba60e77ed113c3b8"
          })
        )
      );
      
      closeSheet();
      setFormData(initialFormState);
      toast.success("Vital signs recorded successfully!");
    } catch (error) {
      console.error("Error creating vital signs:", error);
      toast.error("Failed to record vital signs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative px-6 py-3 h-fit mx-auto bg-white rounded-lg customScrollbar">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Status and DateTime */}
        <CustomSelect
          id="status"
          label="Status"
          required={true}
          value={formData.status}
          onChange={handleInputChange}
          options={statusOptions}
          isInvalid={errors.status}
        />

        <CustomInput
          id="effectiveDateTime"
          label="Date and Time"
          required={true}
          type="datetime-local"
          value={formData.effectiveDateTime}
          onChange={handleInputChange}
          isInvalid={errors.effectiveDateTime}
        />

        {/* Vital Signs Fields */}
        {vitalSignFields.map(field => (
          <div key={field.name}>
            {field.type === "compound" ? (
              // Compound fields (like blood pressure)
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="flex space-x-6">
                  {field.components.map(component => (
                    <CustomInput
                      key={component.name}
                      id={component.name}
                      label={component.label}
                      required={true}
                      type="number"
                      value={formData[component.name]}
                      onChange={handleInputChange}
                      placeholder={`${component.label} (${component.unit})`}
                      isInvalid={errors[component.name]}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Single fields
              <CustomInput
                id={field.name}
                label={field.label}
                required={true}
                type="number"
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={`Enter ${field.label} (${field.unit})`}
                isInvalid={errors[field.name]}
              />
            )}
          </div>
        ))}

        <CustomButton
          type="submit"
          disabled={isLoading}
          text={isLoading ? "Saving..." : "Save Vital Signs"}
        />
      </form>
    </div>
  );
};

export default VitalSigns;