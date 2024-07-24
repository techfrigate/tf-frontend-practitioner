export const personalInfoFormData = [
  {
    heading: "PERSONAL INFORMATION",
    formInput: [
      {
        type: "text",
        label: "First Name",
        id: "FName",
        placeholder: "Enter Your Name",
      },
      {
        type: "text",
        label: "Last Name",
        id: "LName",
        placeholder: "Last Name",
      },
      {
        type: "date",
        label: "Date of Birth",
        id: "DOB",
        placeholder: "",
      },
      {
        type: "number",
        label: "Contact Number (Log In)",
        id: "PhNo",
        placeholder: "Enter Your Phone Number",
      },
      {
        type: "email",
        label: "Email",
        id: "Email",
        placeholder: "Enter Your Email",
      },
    ],
  },
];

export const emergencyContactInfo = [
  {
    heading: "EMERGENCY CONTACT INFORMATION",
    formInput: [
      {
        type: "text",
        label: "Contact Name",
        id: "ContactName",
        placeholder: "Contact Name",
      },
      {
        type: "text",
        label: "Contact Relationship",
        id: "ContactRel",
        placeholder: "Contact Relationship",
      },
      {
        type: "number",
        label: "Contact Number",
        id: "ContactNo",
        placeholder: "Enter your phone number",
      },
      {
        type: "email",
        label: "Contact Email",
        id: "ContactEmail",
        placeholder: "Enter Contact Email",
      },
    ],
  },
];

export const addressInfo = [
  {
    heading: "ADDRESS INFORMATION",
    formInput: [
      {
        type: "text",
        label: "Address Line 1",
        id: "Address1",
        placeholder: "Address Line 1",
      },

      {
        type: "text",
        label: "Address Line 2",
        id: "Address2",
        placeholder: "Address Line 2",
      },
      {
        type: "number",
        label: "PIN",
        id: "PIN",
        placeholder: "Zipcode",
      },
    ],
  },
];
