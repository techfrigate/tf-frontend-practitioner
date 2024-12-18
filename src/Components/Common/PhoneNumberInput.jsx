import React, { useState, useEffect } from "react";

const PhoneNumberInput = ({
  type = "text",
  label,
  id,
  placeholder,
  value,
  dialCode,
  isInvalid,
  onChangeDialCode,
  onChangeNumber,
}) => {
  const [localDialCode, setLocalDialCode] = useState(dialCode);
  const [localNumber, setLocalNumber] = useState(value);
  const dialCodes = ["+91", "+1", "+44", "+61", "+81"];

  useEffect(() => {
    setLocalDialCode(dialCode);
    setLocalNumber(value);
  }, [dialCode, value]);

  const handleDialCodeChange = (e) => {
    const newDialCode = e.target.value;
    setLocalDialCode(newDialCode);
    onChangeDialCode(newDialCode);
    setLocalNumber("");
    onChangeNumber("");
  };

  const handleNumberChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); 
    if (inputValue.length <= 10) {
      onChangeNumber(inputValue);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-col mt-1.5">
        <div className="flex">
          <select
            className={`block w-max px-3 py-1.5 border ${
              isInvalid
                ? "border-red-500 shadow-md shadow-red-400/50 m-max"
                : "border-gray-300"
            } rounded-l-lg focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30`}
            value={localDialCode}
            onChange={handleDialCodeChange}
          >
            {dialCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type={type}
            id={id}
            className={`block w-4/5 px-3 py-1.5 border-t border-b border-r ${
              isInvalid
                ? "border-red-500 shadow-md shadow-red-400/20"
                : "border-gray-300"
            } rounded-r-lg focus:outline-none focus:shadow-md  focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30`}
            placeholder={placeholder}
            value={localNumber}
            onChange={handleNumberChange}
          />
        </div>
        {isInvalid && (
          <p className="mt-[2px] text-[12px] text-red-700">{isInvalid}</p>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
