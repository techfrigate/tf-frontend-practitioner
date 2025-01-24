import React from "react";

const CustomButton = ({ type, text, onclick, width,disabled }) => {
  return (
    <button
    disabled={disabled}
      type={type}
      className={`px-4 pb-2 pt-1.5 text-[14px] bg-[#64C6B0] text-white hover:bg-[#56a897]  transition duration-300 ease-in-out rounded ${
        width ? width : ""
      }`}
      onClick={onclick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
