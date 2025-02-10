export const personalInfoFormData = [
      {
        type: "text",
        label: "First Name",
        id: "firstName",
        placeholder: "Enter Your Name",
        required : true
      },
      {
        type: "text",
        label: "Last Name",
        id: "lastName",
        placeholder: "Last Name",
        required : true
      },
      {
        type: "date",
        label: "Date of Birth",
        id: "dob",
        placeholder: "",
        required : true
      },
      {
        type: "number",
        label: "Contact Number (Log In)",
        id: "phoneNumber",
        placeholder: "Enter Your Phone Number",
        required : true
      },
      {
        type: "email",
        label: "Email",
        id: "email",
        placeholder: "Enter Your Email",
        required : true
      },
    ]


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
        type: "text",
        label: "Address Line 1",
        id: "address1",
        placeholder: "Address Line 1",
        required : true
      },

      {
        type: "text",
        label: "Address Line 2",
        id: "address2",
        placeholder: "Address Line 2",
      },
      {
        type: "number",
        label: "PIN",
        id: "zipCode",
        placeholder: "Zipcode",
        required : true
      },
      {
        type: "text",
        label: "Country",
        id: "country",
        placeholder: "Country",
        required : true
      },
      {
        type: "text",
        label: "State",
        id: "state",
        placeholder: "State",
        required : true
      },
      {
        type: "text",
        label: "City",
        id: "city",
        placeholder: "City",
        required : true
      },
]
