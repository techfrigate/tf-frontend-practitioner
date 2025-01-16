import React, { useState } from "react";
// import { IoIosArrowDown } from "react-icons/io";

const HospitalDropDown = ({ selectedTenant, tenants, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  
  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' '); 
  };

  return (
    <div className="relative">
      <div className="text-black cursor-pointer" onClick={toggleDropdown}>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-700 text-xl mr-3">
            {selectedTenant?.tenantName ? capitalizeFirstLetter(selectedTenant.tenantName) : ""}
            </h1>
          </div>
          {/* <IoIosArrowDown
            className={`text-[1.15rem] transition-transform duration-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          /> */}
        </div>
        {/* {isOpen && (
          <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg mt-2 z-20 shadow-2xl transition-all duration-300 ease-in-out transform scale-95 hover:scale-100">
            {tenants.length > 0 ? (
              tenants.map((tenant, index) =>
                selectedTenant?.tenantId !== tenant.tenantId ? (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer transition-all duration-300 rounded-md text-gray-700 font-semibold text-sm tracking-wide shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-green-400 hover:to-teal-500 hover:text-white"
                    onClick={() => onSelect(tenant)}
                  >
                    <span>{tenant.tenantName}</span>
                    <IoIosArrowDown className="ml-2 transform transition-transform duration-200" />
                  </div>
                ) : null
              )
            ) : (
              <div className="p-3 text-gray-500 text-center italic">
                No More tenants available
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default HospitalDropDown;
