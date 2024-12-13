import React from "react";
import CustomInput from "../../Common/CustomInput";
import PhoneNumberInput from "../../Common/PhoneNumberInput";
import CustomSelect from "../../Common/CustomSelect";
import CustomDatePicker from "../../Common/CustomDatePicker";

const PersonalInfo = ({ personalInfoFormData, personalInfo, handleChange,handlePersonalInfoChange, handleDialCodeChange,inValidObject }) => {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ];

  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 border-b pb-2">
        <h1 className="text-sm font-semibold text-[#1e817e]">PERSONAL INFORMATION</h1>
      </div>
      <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
        {personalInfoFormData?.map((elem) => {
          if (elem.id === "phoneNumber") {
            return (
              <PhoneNumberInput
                key={elem.id}
                type={elem.type}
                label={elem.label}
                id={elem.id}
                placeholder={elem.placeholder}
                dialCode={personalInfo.dialCode}
                value={personalInfo[elem.id]}
                onChangeNumber={(number) =>
                  handlePersonalInfoChange({ target: { id: elem.id, value: number } })
                }
                onChangeDialCode={handleDialCodeChange}
                isInvalid={inValidObject['phoneNumber']}
              />
            );
          }
          if (elem.type === "date") {
            return (
              <CustomDatePicker
                key={elem.id}
                id={elem.id}
                label={elem.label}
                value={personalInfo[elem.id]}
                isInvalid={inValidObject[elem.id]}
                errorMessage={inValidObject[elem.id]} 
                onChange={handleChange}
              />
            );
          }
          return (
            <CustomInput
              key={elem.id}
              type={elem.type}
              label={elem.label}
              id={elem.id}
              placeholder={elem.placeholder}
              value={personalInfo[elem.id]}
              onChange={handlePersonalInfoChange}
              isInvalid={inValidObject[elem.id]}
            />
          );
        })}
        <CustomSelect
          id="gender"
          label="Gender"
          value={personalInfo.gender}
          onChange={handlePersonalInfoChange}
          options={genderOptions}
          isInvalid={inValidObject['gender']}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
