import React from "react";
import CustomInput from "../../Common/CustomInput";
import CustomSelect from "../../Common/CustomSelect";

const AddressInfo = ({ addressFormData, addressInfo, handleAddressInfoChange,inValidObject }) => {
  const countryOptions = [
    { value: "india", label: "India" }
    // Add more countries here
  ];

  const stateOptions = [
    { value: "rajasthan", label: "Rajasthan" }
    // Add more states here
  ];

  const cityOptions = [
    { value: "hanumangarh", label: "Hanumangarh" },
    { value: "churu", label: "Churu" }
    // Add more cities here
  ];

  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 border-b pb-2">
        <h1 className="text-sm font-semibold text-[#1e817e]">ADDRESS INFORMATION</h1>
      </div>
      <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
        {addressFormData?.map((elem) => (
          <CustomInput
            key={elem.id}
            type={elem.type}
            label={elem.label}
            id={elem.id}
            placeholder={elem.placeholder}
            value={addressInfo[elem.id]}
            onChange={handleAddressInfoChange}
            isInvalid={inValidObject[elem.id]}
          />
        ))}
        <CustomSelect
          id="country"
          label="Country"
          value={addressInfo.country}
          onChange={handleAddressInfoChange}
          options={countryOptions}
           isInvalid={inValidObject['country']}
        />
        <CustomSelect
          id="state"
          label="State/Province"
          value={addressInfo.state}
          onChange={handleAddressInfoChange}
          options={stateOptions}
          isInvalid={inValidObject['state']}

        />
        <CustomSelect
          id="city"
          label="City"
          value={addressInfo.city}
          onChange={handleAddressInfoChange}
          options={cityOptions}
          isInvalid={inValidObject['city']}
        />
      </div>
    </div>
  );
};

export default AddressInfo;
