import React from 'react';
import { AiOutlineQuestionCircle, AiOutlineSearch } from "react-icons/ai";

const HelpModal = () => {
  return (
    <div className="absolute z-20 top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-80">
      <div className="flex items-center mb-4">
        <AiOutlineQuestionCircle size={24} className="text-[#64C6B0]"/>
        <h2 className="text-lg font-bold ml-2">Help</h2>
      </div>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border text-gray-400 border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-[#64C6B0]"
        />
        <AiOutlineSearch size={20} className="absolute left-3 top-2.5 text-gray-400"/>
      </div>
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#64C6B0] rounded-full opacity-25 animate-ping"></div>
            <AiOutlineSearch size={40} className="text-[#64C6B0]" />
          </div>
        </div>
        <p className="text-gray-600">No Data found</p>
      </div>
    </div>
  );
};

export default HelpModal;
