 
import React from "react";
import CustomInput from "../../Components/Common/CustomInput";
import CustomSelect from "../../Components/Common/CustomSelect";
import PhoneNumberInput from "../../Components/Common/PhoneNumberInput";
import CustomDatePicker from "../../Components/Common/CustomDatePicker";
import { User, UserIcon } from "lucide-react";
 
 

const PersonalInfo = ({ personalInfoFormData, personalInfo, handleChange,handlePersonalInfoChange, handleDialCodeChange,inValidObject }) => {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ];

  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 border-b pb-2 mb-4">
        <User className="w-5 h-5 text-[#64c6b0]" />
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
                value={personalInfo[elem?.id]}
                onChangeNumber={(number) =>
                  handlePersonalInfoChange({ target: { id: elem.id, value: number } })
                }
                onChangeDialCode={handleDialCodeChange}
                isInvalid={inValidObject['phoneNumber']}
                required={elem.required}
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
                required={elem.required}
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
              value={personalInfo[elem?.id]}
              onChange={handlePersonalInfoChange}
              isInvalid={inValidObject[elem.id]}
              required={elem.required}

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
          required={true}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
