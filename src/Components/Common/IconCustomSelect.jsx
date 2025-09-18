import React, { useState } from "react";

const IconCustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options?.length && options.find((option) => option.value === value);

  return (
    <div className="relative">
      <div
        className={`w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
            flex items-center space-x-3 gap-2 cursor-pointer
            ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "hover:border-gray-500"
            }
            ${isOpen ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {icon && <div className="text-gray-500">{icon}</div>}
        {selectedOption ? selectedOption.label : placeholder}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border  overflow-y-auto border-gray-200 rounded-xl shadow-lg max-h-60 ">
          {options?.length && options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
            >
              {option.icon && (
                <div className="text-gray-500">{option.icon}</div>
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconCustomSelect;
