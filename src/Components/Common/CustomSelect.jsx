import React from "react";

const CustomSelect = ({ id, label, value, onChange, options,isInvalid }) => (
  <div>
    <label htmlFor={id} className="text-gray-800 text-sm font-medium mb-1">
      {label}<span className="text-gray-400">*</span>
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm ${
        isInvalid ? "border-red-500 shadow-md shadow-red-400/30" : "border-gray-300 "
      } focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 border-gray-300`}
    >
      <option value="" disabled>Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {isInvalid && <p className="text-[12px] text-red-700 mt-1">{isInvalid}</p>}
    
  </div>
);

export default CustomSelect;
