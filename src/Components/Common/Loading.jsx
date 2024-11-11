import React from "react";

const Loading = ({ size = "12", color = "teal-500", className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin border-t-4 border-${color} w-${size} h-${size} border-solid rounded-full`}
      ></div>
    </div>
  );
};

export default Loading;
