import React from "react";

const CustomInput = ({
  type,
  label,
  id,
  placeholder,
  onChange,
  value,
  isInvalid,
}) => (
  <div>
    <label htmlFor={id} className="text-gray-800 text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      // onChange={onChange}
      onChange={(e) => onChange(e)}
      value={value}
      className={`flex h-10 w-full rounded-lg border ${
        isInvalid ? "border-red-500 shadow-md shadow-red-400/30" : "border-gray-300 "
      } bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
    />
    {isInvalid && <p className="text-[12px] text-red-700 mt-1">{isInvalid}</p>}
  </div>
);

export default CustomInput;

 