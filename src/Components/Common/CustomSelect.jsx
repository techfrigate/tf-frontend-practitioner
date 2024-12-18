import React from "react";

const CustomSelect = ({ id, label, value, onChange, options, isInvalid }) =>{ 
  const locationTypes = ["country", "state", "city"];
 

  return (
  <div className="flex flex-col w-full mb-4">
  <label
    htmlFor={id}
    className="text-gray-800 text-sm font-medium mb-1"
  >
    {label}
  </label>
  <select
    id={id}
    name={id}
    value={value}
    onChange={onChange}
    className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm ${
      isInvalid
        ? "border-red-500 shadow-md shadow-red-400/30"
        : "border-gray-300 shadow-md shadow-gray-100/50"
    } focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 transition duration-200 ease-in-out`}
  >
    <option value="" disabled>
      Select {label}
    </option>
        {options.map((option) => {
          if (locationTypes.includes(id)) {
            return (
              <option key={option.id} value={option.name} id={option.id}>
                {option.name}
              </option>
            );
          }
           else {
            return (
            <option key={option.value} value={option.value}>
        {option.label}
      </option>
            );
          }
        })}
  </select>
  {isInvalid && (
    <p className="text-[12px] text-red-700 mt-1">{isInvalid}</p>
  )}
</div>
);
}



export default CustomSelect;
