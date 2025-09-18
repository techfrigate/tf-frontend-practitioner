import React from "react";

const CustomButton = ({ type, text, onclick, width,disabled ,loading}) => {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`px-4 pb-2 pt-1.5 cursor-pointer text-[16px] bg-[#64C6B0] text-white 
        hover:bg-[#56a897] transition duration-300 ease-in-out rounded focus:outline-none
        focus:ring-2 focus:ring-[#56a897] focus:ring-offset-2
        ${width ? width : ""} 
        ${disabled || loading ? "cursor-not-allowed opacity-50" : ""}`}
       onClick={onclick}
    >
      {loading ? (
        <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;
