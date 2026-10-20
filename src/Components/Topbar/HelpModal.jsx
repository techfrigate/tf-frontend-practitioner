import React from 'react';
import { AiOutlineQuestionCircle, AiOutlineSearch } from "react-icons/ai";

const HelpModal = () => {
  return (
    <div className="absolute z-40 top-12 right-0 w-80 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <AiOutlineQuestionCircle size={24} className="text-brand-500"/>
        <h2 className="text-lg font-bold ml-2">Help</h2>
      </div>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border text-gray-400 border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-brand-500"
        />
        <AiOutlineSearch size={20} className="absolute left-3 top-2.5 text-gray-400"/>
      </div>
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 rounded-full opacity-25 animate-ping"></div>
            <AiOutlineSearch size={40} className="text-brand-500" />
          </div>
        </div>
        <p className="text-gray-600">No Data found</p>
      </div>
    </div>
  );
};

export default HelpModal;
