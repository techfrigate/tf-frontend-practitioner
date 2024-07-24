import React from "react";

const CustomTable = ({ trHeader, children }) => {
  return (
    <div className="overflow-x-hidden relative shadow-md sm:rounded-lg w-[100%] ">
      <table className="w-full text-sm text-gray-900 bg-white">
        <thead className="bg-[#64c6b0]">{trHeader}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default CustomTable;
