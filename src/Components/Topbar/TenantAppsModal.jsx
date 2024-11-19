import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const TenantAppsModal = ({ tenant, onClose, onSelectApp }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black opacity-70 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-wide">
          Choose Your Application
        </h2>
        <ul className="space-y-3">
          {tenant.userType.map((type, index) => (
            <li
              key={index}
              className="p-4 text-center font-semibold text-gray-800 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 shadow-md cursor-pointer transition-all transform hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-600 hover:text-white hover:scale-105"
              onClick={() => onSelectApp(type)}
            >
              {`${type} App`}
            </li>
          ))}
        </ul>
        <button
          className="mt-8 w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TenantAppsModal;
