import React, { useState, useEffect } from "react";

const PhoneNumberInput = ({type = "text",label,id,placeholder,value,dialCode,isInvalid,onChangeDialCode,onChangeNumber,required=false}) => {
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
        {label} {required &&<span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-col mt-1.5">
        <div className={`flex border h-10 rounded-lg transition-all ${
            isInvalid
              ? "border-red-500 shadow-md shadow-red-400/30"
              : "border-gray-300 focus-within:border-[#64C6B0] focus-within:shadow-md focus-within:shadow-[#64C6B0]/30"
          }`}>
          <select
             className={`w-1/5 px-3 py-[7px] bg-white rounded-l-lg focus:outline-none`}
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
            className={`w-4/5 px-3 py-[7px] bg-white rounded-lg focus:outline-none focus:bg-transparent`}
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
