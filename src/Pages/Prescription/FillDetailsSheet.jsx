import React from "react";
import { ArrowLeft } from "lucide-react";
import GlobalForm from "../../Components/Common/GlobalForm";
import { useDispatch } from "react-redux";
import { addFormData, setFormData } from "../../../src/Store/prescriptionformDataSlice";
import { useSelector } from "react-redux";

const FillDetailsSheet = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedCategory,
  closeSheet,
}) => {
  const dispatch = useDispatch();

  if (!isDialogOpen || !selectedCategory) return null;

  if (selectedCategory.name === "Chief Complaints") {
    selectedCategory.name = "ChiefComplaints";
  } else if (selectedCategory.name === "Surgical History") {
    selectedCategory.name = "SurgicalHistory";
  } else if (selectedCategory.name === "Medical History") {
    selectedCategory.name = "MedicalHistory";
  } else if (selectedCategory.name === "Family History") {
    selectedCategory.name = "FamilyHistory";
  }

  const categoryFormFields = {
    Allergies: [
      {
        name: "allergen",
        label: "Allergen",
        type: "input",
        suggestions: ["Peanuts", "Dairy", "Eggs", "Shellfish", "Pollen"],
        placeholder: "Enter Allergen",
        required: true,
      },
      {
        name: "clinicalStatus",
        label: "Clinical Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "resolved", label: "Resolved" },
        ],
        required: true,
      },
      {
        name: "reactionManifestation",
        label: "Reaction Manifestation",
        type: "input",
        suggestions: ["Rash", "Swelling", "Hives", "Shortness of Breath"], // Example suggestions
        placeholder: "Enter Reaction Manifestation",
        required: true,
      },
      {
        name: "reactionSubstance",
        label: "Reaction Substance",
        type: "input",
        suggestions: ["Latex", "Penicillin", "Bee Stings", "Food"], // Example suggestions
        placeholder: "Enter Reaction Substance",
        required: false,
      },
      {
        name: "reactionExposureRoute",
        label: "Reaction Exposure Route",
        type: "input",
        suggestions: ["Oral", "Intravenous", "Inhalation", "Topical"], // Example suggestions
        placeholder: "Enter Exposure Route",
        required: false,
      },
      {
        name: "reactionSeverity",
        label: "Reaction Severity",
        type: "select",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "severe", label: "Severe" },
        ],
        required: true,
      },
      {
        name: "reactionDescription",
        label: "Reaction Description",
        type: "input",
        placeholder: "Enter Reaction Description",
        required: false,
      },
      {
        name: "criticality",
        label: "Criticality",
        type: "select",
        options: [
          { value: "high", label: "High" },
          { value: "low", label: "Low" },
          { value: "unabletoaccess", label: "Unable-To-Access" },
        ],
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "food", label: "Food" },
          { value: "medication", label: "Medication" },
          { value: "environment", label: "Environment" },
          { value: "biologic", label: "Biologic" },
        ],
        required: true,
      },
      {
        name: "verificationStatus",
        label: "Verification Status",
        type: "select",
        options: [
          { value: "confirmed", label: "Confirmed" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "refuted", label: "Refuted" },
        ],
        required: true,
      },
      {
        name: "onsetDateTime",
        label: "Onset DateTime",
        type: "datetime-local",
        required: true,
        value: "2024-10-08T11:00",
      },
      {
        name: "recordedDate",
        label: "Recorded Date",
        type: "datetime-local",
        required: true,
        value: "2024-10-08T11:10",
      },
      {
        name: "lastOccurrence",
        label: "Last Occurrence",
        type: "datetime-local",
        required: false,
        value: "2024-10-16T11:44",
      },
      {
        name: "note",
        label: "Note",
        type: "input",
        placeholder: "Enter Note",
        required: false,
      },
    ],
    Vitals: [
      {
        name: "heartRate",
        label: "Heart Rate",
        type: "number",
        placeholder: "E.g., 72 bpm",
      },
      {
        name: "bloodPressure",
        label: "Blood Pressure",
        type: "text",
        placeholder: "E.g., 120/80 mmHg",
      },
      {
        name: "temperature",
        label: "Temperature",
        type: "number",
        placeholder: "E.g., 98.6 °F",
      },
    ],
    ChiefComplaints: [
      {
        name: "bodySite",
        label: "Body Site",
        type: "input",
        placeholder: "Enter Body Site",
        required: true,
      },
      {
        name: "clinicalStatus",
        label: "Clinical Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "resolved", label: "Resolved" },
        ],
        required: true,
      },
      {
        name: "verificationStatus",
        label: "Verification Status",
        type: "select",
        options: [
          { value: "confirmed", label: "Confirmed" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "refuted", label: "Refuted" },
        ],
        required: true,
      },
      {
        name: "severity",
        label: "Severity",
        type: "input",
        placeholder: "Enter Severity",
        required: true,
      },
      {
        name: "onsetDateTime",
        label: "Onset DateTime",
        type: "datetime-local",
        required: true,
      },
      {
        name: "recordedDate",
        label: "Recorded Date",
        type: "datetime-local",
        required: true,
      },
      {
        name: "stageSummary",
        label: "Stage Summary",
        type: "input",
        placeholder: "Enter Stage Summary",
        required: false,
      },
      {
        name: "stageType",
        label: "Stage Type",
        type: "input",
        placeholder: "Enter Stage Type",
        required: false,
      },
      {
        name: "evidenceCode",
        label: "Evidence Code",
        type: "input",
        placeholder: "Enter Evidence Code",
        required: false,
      },
      {
        name: "note",
        label: "Note",
        type: "textarea",
        placeholder: "Enter Note",
        required: false,
      },
    ],
    Procedures: [
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "completed", label: "Completed" },
          { value: "in-progress", label: "In Progress" },
          { value: "not-performed", label: "Not Performed" },
        ],
        required: true,
      },
      {
        name: "statusReason",
        label: "Status Reason",
        type: "input",
        placeholder: "Enter Status Reason",
        required: false,
      },
      {
        name: "procedure",
        label: "Procedure",
        type: "input",
        placeholder: "Enter Procedure",
        required: true,
      },
      {
        name: "performedDateTime",
        label: "Performed Date Time",
        type: "datetime-local",
        required: true,
      },
      {
        name: "function",
        label: "Function",
        type: "input",
        placeholder: "Enter Function",
        required: false,
      },
      {
        name: "reasonCode",
        label: "Reason Code",
        type: "input",
        placeholder: "Enter Reason Code",
        required: false,
      },
      {
        name: "bodySite",
        label: "Body Site",
        type: "input",
        placeholder: "Enter Body Site",
        required: true,
      },
      {
        name: "outcome",
        label: "Outcome",
        type: "input",
        placeholder: "Enter Outcome",
        required: false,
      },
      {
        name: "complication",
        label: "Complication",
        type: "input",
        placeholder: "Enter Complication",
        required: false,
      },
      {
        name: "followUp",
        label: "Follow Up",
        type: "input",
        placeholder: "Enter Follow Up",
        required: false,
      },
      {
        name: "note",
        label: "Note",
        type: "textarea",
        placeholder: "Enter Note",
        required: false,
      },
      {
        name: "usedCode",
        label: "Used Code",
        type: "input",
        placeholder: "Enter Used Code",
        required: false,
      },
    ],
    SurgicalHistory: [
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "completed", label: "Completed" },
          { value: "in-progress", label: "In Progress" },
          { value: "not-performed", label: "Not Performed" },
        ],
        required: true,
      },
      {
        name: "statusReason",
        label: "Status Reason",
        type: "text",
        placeholder: "Enter Status Reason",
        required: false,
      },
      {
        name: "code",
        label: "Code",
        type: "text",
        placeholder: "Enter Code",
        required: true,
      },
      {
        name: "performedDateTime",
        label: "Performed Date Time",
        type: "datetime-local",
        required: true,
      },
      {
        name: "function",
        label: "Function",
        type: "text",
        placeholder: "Enter Function",
        required: false,
      },
      {
        name: "reasonCode",
        label: "Reason Code",
        type: "text",
        placeholder: "Enter Reason Code",
        required: false,
      },
      {
        name: "bodySite",
        label: "Body Site",
        type: "text",
        placeholder: "Enter Body Site",
        required: true,
      },
      {
        name: "outcome",
        label: "Outcome",
        type: "text",
        placeholder: "Enter Outcome",
        required: false,
      },
      {
        name: "complication",
        label: "Complication",
        type: "text",
        placeholder: "Enter Complication",
        required: false,
      },
      {
        name: "followUp",
        label: "Follow Up",
        type: "text",
        placeholder: "Enter Follow Up",
        required: false,
      },
      {
        name: "note",
        label: "Note",
        type: "textarea",
        placeholder: "Enter Note",
        required: false,
      },
      {
        name: "usedCode",
        label: "Used Code",
        type: "text",
        placeholder: "Enter Used Code",
        required: false,
      },
    ],
    MedicalHistory: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Enter Name",
        required: true,
      },
      {
        name: "bodySite",
        label: "Body Site",
        type: "text",
        placeholder: "Enter Body Site",
        required: true,
      },
      {
        name: "clinicalStatus",
        label: "Clinical Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "resolved", label: "Resolved" },
        ],
        required: true,
      },
      {
        name: "verificationStatus",
        label: "Verification Status",
        type: "select",
        options: [
          { value: "confirmed", label: "Confirmed" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "refuted", label: "Refuted" },
        ],
        required: true,
      },
      {
        name: "severity",
        label: "Severity",
        type: "text",
        placeholder: "Enter Severity",
        required: true,
      },
      {
        name: "onsetDateTime",
        label: "Onset DateTime",
        type: "datetime-local",
        required: true,
      },
      {
        name: "recordedDate",
        label: "Recorded Date",
        type: "datetime-local",
        required: true,
      },
      {
        name: "stageSummary",
        label: "Stage Summary",
        type: "text",
        placeholder: "Enter Stage Summary",
        required: false,
      },
      {
        name: "stageType",
        label: "Stage Type",
        type: "text",
        placeholder: "Enter Stage Type",
        required: false,
      },
      {
        name: "evidenceCode",
        label: "Evidence Code",
        type: "text",
        placeholder: "Enter Evidence Code",
        required: false,
      },
      {
        name: "note",
        label: "Note",
        type: "textarea",
        placeholder: "Enter Note",
        required: false,
      },
    ],
    FamilyHistory: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Enter Name",
        required: true,
      },
      {
        name: "relation",
        label: "Relation",
        type: "select",
        options: [
          { value: "father", label: "Father" },
          { value: "mother", label: "Mother" },
          { value: "sibling", label: "Sibling" },
          { value: "grandparent", label: "Grandparent" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
      {
        name: "dob",
        label: "DOB",
        type: "datetime-local",
        required: true,
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "Enter Age",
        required: true,
      },
      {
        name: "diagnosis",
        label: "Diagnosis",
        type: "text",
        placeholder: "Enter Diagnosis",
        required: true,
      },
      {
        name: "reason",
        label: "Reason",
        type: "text",
        placeholder: "Enter Reason",
        required: false,
      },
      {
        name: "outcome",
        label: "Outcome",
        type: "text",
        placeholder: "Enter Outcome",
        required: false,
      },
      {
        name: "date",
        label: "Date",
        type: "datetime-local",
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "alive", label: "Alive" },
          { value: "deceased", label: "Deceased" },
          { value: "unknown", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "note",
        label: "Note",
        type: "textarea",
        placeholder: "Enter Note",
        required: false,
      },
    ],
  };

  

  const handleSubmit = (formData) => {
    dispatch(addFormData({ category: selectedCategory.name, data: formData }));
    closeSheet();
  };

  // Retrieve form fields for the selected category
  const formFields = categoryFormFields[selectedCategory.name] || [];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black bg-opacity-10"
        onClick={closeSheet}
      ></div>

      {/* Sliding Sheet from the Right */}
      <div className="bg-white w-[45%] h-full p-6 shadow-lg transform transition-transform translate-x-0 ease-in-out duration-300 fixed top-0 right-0">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <ArrowLeft
              size={20}
              className="text-gray-500 cursor-pointer"
              onClick={closeSheet}
            />
            <h2 className="text-lg font-semibold">{`Fill Details for ${selectedCategory?.name}`}</h2>
          </div>
          <button
            onClick={closeSheet}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Form for filling details */}
        <GlobalForm
          formFields={formFields}
          onSubmit={handleSubmit}
          buttonText="Save Changes"
          className="space-y-4"
        />
      </div>
    </div>
  );
};

export default FillDetailsSheet;
