// AllergyIntoleranceData
export const AllergenData = [
  // Basic Allergy Info
  {
    name: "allergen",
    label: "Allergen",
    required: true,
    fieldType: "search",
    placeholder: "Search for allergen...",
    ecl: "<<404684003",
  },
  {
    name: "category",
    label: "Category",
    fieldType: "select",
    required: true,
    options: [
      { value: "food", label: "Food" },
      { value: "medication", label: "Medication" },
      { value: "environment", label: "Environment" },
      { value: "biologic", label: "Biologic" },
    ],
  },
  {
    name: "criticality",
    label: "Criticality",
    required: true,
    fieldType: "select",
    options: [
      { value: "low", label: "Low" },
      { value: "high", label: "High" },
      { value: "unable-to-assess", label: "Unable to Assess" },
    ],
  },
  {
    name: "reactionSeverity",
    label: "Reaction Severity",
    required: true,
    fieldType: "select",
    options: [
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
  },
  // Status
  {
    name: "clinicalStatus",
    label: "Clinical Status",
    fieldType: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "resolved", label: "Resolved" },
    ],
  },
  {
    name: "verificationStatus",
    label: "Verification Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "unconfirmed", label: "Unconfirmed" },
      { value: "confirmed", label: "Confirmed" },
      { value: "refuted", label: "Refuted" },
      { value: "entered-in-error", label: "Entered in Error" },
    ],
  },
  // Reaction Details
  {
    name: "reactionManifestation",
    label: "Reaction Manifestation",
    required: true,
    fieldType: "search",
    placeholder: "Search for manifestation...",
    ecl: "<<404684003",
  },
  {
    name: "reactionSubstance",
    label: "Reaction Substance",
    required: true,
    fieldType: "search",
    placeholder: "Search for substance...",
    ecl: "<<105590001",
  },
  {
    name: "reactionExposureRoute",
    label: "Reaction Exposure Route",
    required: true,
    fieldType: "search",
    placeholder: "Search for exposure route...",
    ecl: "<<91723000",
  },
  // Dates
  {
    name: "onsetDateTime",
    label: "Onset DateTime",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "lastOccurrence",
    label: "Last Occurrence",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  // Additional Info
  {
    name: "note",
    label: "Note",
    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];

// VitalSignsData
export const VitalSignsData = {
  vitalSignFields: [
    {
      name: "bloodPressure",
      label: "Blood Pressure",
      type: "compound",
      components: [
        {
          name: "systolic",
          label: "Systolic",
          required: true,
          type: "number",
          unit: "mmHg",
          code: "8480-6",
          system: "http://loinc.org",
          display: "Systolic blood pressure",
        },
        {
          name: "diastolic",
          label: "Diastolic",
          required: true,
          type: "number",
          unit: "mmHg",
          code: "8462-4",
          system: "http://loinc.org",
          display: "Diastolic blood pressure",
        },
      ],
    },
    {
      name: "heartRate",
      label: "Heart Rate",
      required: true,
      type: "number",
      unit: "/min",
      code: "8867-4",
      system: "http://loinc.org",
      display: "Heart rate",
    },
    {
      name: "temperature",
      label: "Body Temperature",
      required: true,
      type: "number",
      unit: "°C",
      code: "8310-5",
      system: "http://loinc.org",
      display: "Body temperature",
    },
    {
      name: "respiratoryRate",
      label: "Respiratory Rate",
      required: true,
      type: "number",
      unit: "/min",
      code: "9279-1",
      system: "http://loinc.org",
      display: "Respiratory rate",
    },
    {
      name: "oxygenSaturation",
      label: "Oxygen Saturation",
      required: true,
      type: "number",
      unit: "%",
      code: "2708-6",
      system: "http://loinc.org",
      display: "Oxygen saturation",
    },
  ],

  statusOptions: [
    { value: "preliminary", label: "Preliminary" },
    { value: "final", label: "Final" },
    { value: "amended", label: "Amended" },
    { value: "corrected", label: "Corrected" },
    { value: "cancelled", label: "Cancelled" },
  ],
};

// ChiefComplaintData
export const ChiefComplaintData = [
  // Basic Complaint Info
  {
    name: "condition",
    label: "Chief Complaint",
    required: true,
    fieldType: "search",
    placeholder: "Search for condition...",
    ecl: "<<404684003", // Clinical findings
  },
  {
    name: "category",
    label: "Category",
    required: true,
    fieldType: "select",
    options: [
      { value: "administrative", label: "Administrative" },
      { value: "clinical", label: "Clinical" },
      { value: "technical", label: "Technical" },
      { value: "service", label: "Service" },
      { value: "billing", label: "Billing" },
    ],
  },
  {
    name: "severity",
    label: "Severity",
    required: true,
    fieldType: "select",
    options: [
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
  },
  // Status Information
  {
    name: "clinicalStatus",
    label: "Clinical Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "recurrence", label: "Recurrence" },
      { value: "inactive", label: "Inactive" },
      { value: "remission", label: "Remission" },
      { value: "resolved", label: "Resolved" },
    ],
  },
  {
    name: "verificationStatus",
    label: "Verification Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "unconfirmed", label: "Unconfirmed" },
      { value: "confirmed", label: "Confirmed" },
      { value: "refuted", label: "Refuted" },
    ],
  },
  // Dates
  {
    name: "onsetDateTime",
    label: "Onset Date/Time",
    fieldType: "local-date",
    required: true,
    type: "datetime-local",
  },
  {
    name: "abatementDateTime",
    label: "Abatement Date/Time",
    fieldType: "local-date",
    required: true,
    type: "datetime-local",
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    fieldType: "local-date",
    required: true,
    type: "datetime-local",
  },
  // Additional Information
  {
    name: "note",
    label: "Notes",
    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];

// DiagnosisData
export const DiagnosisData = [
  // Basic Diagnosis Info
  {
    name: "diagnosis",
    label: "Diagnosis",
    required: true,
    fieldType: "search",
    placeholder: "Search for diagnosis...",
    ecl: "<<404684003", // Clinical finding
  },
  {
    name: "category",
    label: "Category",
    required: true,
    fieldType: "select",
    options: [
      { value: "problem-list-item", label: "Problem List Item" },
      { value: "encounter-diagnosis", label: "Encounter Diagnosis" },
      { value: "health-concern", label: "Health Concern" },
    ],
  },
  {
    name: "severity",
    label: "Severity",
    required: true,
    fieldType: "select",
    options: [
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
  },
  {
    name: "bodySite",
    label: "Body Site",
    required: true,
    fieldType: "search",
    placeholder: "Search for body site...",
    ecl: "<<123037004", // Body structure
  },
  // Status Information
  {
    name: "clinicalStatus",
    label: "Clinical Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "recurrence", label: "Recurrence" },
      { value: "relapse", label: "Relapse" },
      { value: "inactive", label: "Inactive" },
      { value: "remission", label: "Remission" },
      { value: "resolved", label: "Resolved" },
    ],
  },
  {
    name: "verificationStatus",
    label: "Verification Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "unconfirmed", label: "Unconfirmed" },
      { value: "provisional", label: "Provisional" },
      { value: "differential", label: "Differential" },
      { value: "confirmed", label: "Confirmed" },
      { value: "refuted", label: "Refuted" },
      { value: "entered-in-error", label: "Entered in Error" },
    ],
  },
  // Dates
  {
    name: "onsetDateTime",
    label: "Onset Date/Time",
    required: true,
    type: "datetime-local",
  },
  {
    name: "abatementDateTime",
    label: "Abatement Date/Time",
    required: true,
    type: "datetime-local",
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    required: true,
    type: "datetime-local",
  },
  // Additional Information
  {
    name: "note",
    label: "Note",
    placeholder: "Enter additional notes...",
    fieldType: "textArea",
  },
];

//MedicationData
export const MedicationData = [
  {
    name: "medication",
    label: "Medication",
    required: true,
    fieldType: "search",
    placeholder: "Search for medication...",
    ecl: "<<410942007",
  },

  {
    name: "doseAmount",
    label: "Dose Amount",
    required: true,
    placeholder: "Enter dose amount...",
    type: "number",
  },
  {
    name: "doseUnit",
    label: "Dose Unit",
    required: true,
    fieldType: "select",
    options: [
      { value: "mg", label: "mg" },
      { value: "g", label: "g" },
      { value: "ml", label: "ml" },
      { value: "tablet", label: "tablet(s)" },
      { value: "capsule", label: "capsule(s)" },
      { value: "patch", label: "patch(es)" },
      { value: "spray", label: "spray(s)" },
      { value: "drop", label: "drop(s)" },
    ],
  },
  {
    name: "route",
    label: "Route",
    required: true,
    fieldType: "select",
    options: [
      { value: "oral", label: "Oral" },
      { value: "sublingual", label: "Sublingual" },
      { value: "topical", label: "Topical" },
      { value: "subcutaneous", label: "Subcutaneous" },
      { value: "intramuscular", label: "Intramuscular" },
      { value: "intravenous", label: "Intravenous" },
      { value: "nasal", label: "Nasal" },
      { value: "inhalation", label: "Inhalation" },
    ],
  },

  {
    name: "frequency",
    label: "Frequency",
    required: true,
    fieldType: "select",
    options: [
      { value: "once", label: "Once" },
      { value: "daily", label: "Daily" },
      { value: "bid", label: "Twice daily" },
      { value: "tid", label: "Three times daily" },
      { value: "qid", label: "Four times daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "prn", label: "As needed" },
    ],
  },
  {
    name: "duration",
    label: "Duration (days)",
    required: true,
    placeholder: "Enter duration in days...",
    type: "number",
  },
  {
    name: "quantity",
    label: "Quantity",
    required: true,
    placeholder: "Enter quantity...",
    type: "number",
  },
  {
    name: "refills",
    label: "Refills",
    required: true,
    placeholder: "Enter number of refills...",
    type: "number",
  },
  {
    name: "status",
    label: "Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "proposal", label: "Proposal" },
      { value: "plan", label: "Plan" },
      { value: "order", label: "Order" },
      { value: "original-order", label: "Original Order" },
      { value: "reflex-order", label: "Reflex Order" },
      { value: "filler-order", label: "Filler Order" },
      { value: "instance-order", label: "Instance Order" },
    ],
  },

  {
    name: "intent",
    label: "Intent",
    required: true,
    fieldType: "select",
    options: [
      { value: "proposal", label: "Proposal" },
      { value: "plan", label: "Plan" },
      { value: "order", label: "Order" },
      { value: "original-order", label: "Original Order" },
      { value: "reflex-order", label: "Reflex Order" },
      { value: "filler-order", label: "Filler Order" },
      { value: "instance-order", label: "Instance Order" },
    ],
  },

  {
    name: "priority",
    label: "Priority",
    required: true,
    fieldType: "select",
    options: [
      { value: "routine", label: "Routine" },
      { value: "urgent", label: "Urgent" },
      { value: "asap", label: "ASAP" },
      { value: "stat", label: "STAT" },
    ],
  },
  {
    name: "authoredOn",
    label: "Authored On",
    required: true,
    type: "datetime-local",
  },

  {
    name: "dosageInstructions",
    label: "Dosage Instructions",
    required: true,
    type: "text",
    placeholder: "Enter specific dosage instructions...",
  },

  {
    name: "note",
    label: "Additional Notes",

    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];

// ProcedureData
export const ProcedureData = [
  {
    name: "procedure",
    label: "Procedure",
    required: true,
    fieldType: "search",
    placeholder: "Search for procedure...",
    ecl: "<<71388002", // Procedure concept
  },
  {
    name: "status",
    label: "Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "preparation", label: "Preparation" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "stopped", label: "Stopped" },
    ],
  },
  {
    name: "category",
    label: "Category",
    required: true,
    fieldType: "select",
    options: [
      { value: "surgery", label: "Surgery" },
      { value: "diagnostic", label: "Diagnostic" },
      { value: "therapy", label: "Therapy" },
      { value: "education", label: "Education" },
      { value: "assessment", label: "Assessment" },
    ],
  },
  {
    name: "priority",
    label: "Priority",
    required: true,
    fieldType: "select",
    options: [
      { value: "stat", label: "Stat" },
      { value: "urgent", label: "Urgent" },
      { value: "routine", label: "Routine" },
    ],
  },
  {
    name: "bodySite",
    label: "Body Site",
    required: true,
    fieldType: "search",
    placeholder: "Search for body site...",
    ecl: "<<123037004", // Body structure
  },
  {
    name: "performedDateTime",
    label: "Performed Date/Time",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "outcome",
    label: "Outcome",
    required: true,
    fieldType: "input",
    placeholder: "Enter procedure outcome...",
    type: "text",
  },

  {
    name: "note",
    label: "Note",

    placeholder: "Enter additional notes...",
    fieldType: "textAreay",
  },
];

// FamilyHistoryData
export const FamilyHistoryData = [
  {
    name: "relationship",
    label: "Relationship",
    required: true,
    fieldType: "select",
    options: [
      { value: "FTH", label: "Father" },
      { value: "MTH", label: "Mother" },
      { value: "BRO", label: "Brother" },
      { value: "SIS", label: "Sister" },
      { value: "GRMTH", label: "Grandmother" },
      { value: "GRFTH", label: "Grandfather" },
    ],
  },

  {
    name: "status",
    label: "Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "partial", label: "Partial" },
      { value: "completed", label: "Completed" },
      { value: "entered-in-error", label: "Entered in Error" },
      { value: "health-unknown", label: "Health Unknown" },
    ],
  },

  {
    name: "condition",
    label: "Condition",
    required: true,
    fieldType: "search",
    placeholder: "Search for condition...",
    ecl: "<<404684003",
  },

  {
    name: "date",
    label: "Record Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },

  {
    name: "note",
    label: "Notes",

    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];

// SurgicalHistoryData
export const SurgicalHistoryData = [
  {
    name: "procedure",
    label: "Procedure",
    required: true,
    fieldType: "search",
    placeholder: "Search for procedure...",
    ecl: "<<71388002", // Procedure
  },
  {
    name: "status",
    label: "Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "entered-in-error", label: "Entered in Error" },
    ],
  },
  {
    name: "verificationStatus",
    label: "Verification Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "unconfirmed", label: "Unconfirmed" },
      { value: "confirmed", label: "Confirmed" },
      { value: "refuted", label: "Refuted" },
    ],
  },
  {
    name: "bodySite",
    label: "Body Site",
    required: true,
    fieldType: "search",
    placeholder: "Search for body site...",
    ecl: "<<123037004", // Body structure
  },

  {
    name: "performedDateTime",
    label: "Procedure Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },

  {
    name: "note",
    label: "Notes",

    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];

// MedicalHistoryData
export const MedicalHistoryData = [
  {
    name: "condition",
    label: "Condition",
    required: true,
    fieldType: "search",
    placeholder: "Search for condition...",
    ecl: "<<404684003", // Clinical finding
  },

  {
    name: "clinicalStatus",
    label: "Clinical Status",
    required: true,
    fieldType: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "resolved", label: "Resolved" },
    ],
  },
  {
    name: "verificationStatus",
    required: true,
    label: "Verification Status",
    fieldType: "select",
    options: [
      { value: "unconfirmed", label: "Unconfirmed" },
      { value: "confirmed", label: "Confirmed" },
      { value: "refuted", label: "Refuted" },
    ],
  },
  {
    name: "severity",
    label: "Severity",
    required: true,
    fieldType: "select",
    options: [
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
  },
  {
    name: "bodySite",
    label: "Body Site",
    required: true,
    fieldType: "search",
    placeholder: "Search for body site...",
    ecl: "<<123037004", // Body structure
  },

  {
    name: "onsetDateTime",
    label: "Onset Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    fieldType: "local-date",
    type: "datetime-local",
  },
  {
    name: "abatementDateTime",
    label: "Resolution Date",
    required: true,
    fieldType: "local-date",
    type: "datetime-local",
  },

  {
    name: "note",
    label: "Notes",

    fieldType: "textArea",
    placeholder: "Enter additional notes...",
  },
];
