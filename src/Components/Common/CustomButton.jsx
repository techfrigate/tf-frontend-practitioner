import React from "react";

const CustomButton = ({ type, text, onclick, width,disabled ,loading}) => {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 cursor-pointer text-sm font-medium bg-brand-500 text-white
        shadow-sm hover:bg-brand-600 transition-colors rounded-lg focus:outline-none
        focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2
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
