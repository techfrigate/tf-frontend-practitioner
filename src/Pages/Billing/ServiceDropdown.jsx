  import React, { useState } from "react";
  import { serviceData } from "./billingdata";
  import { Zap, Receipt } from "lucide-react";

  const ServiceDropdown = ({ onAddService,billId, }) => {
    const [category    , setCategory    ] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [quantity, setQuantity] = useState(1); 

    const handleServiceTypeChange = (e) => {
      setCategory(e.target.value);
      setSelectedService("");
      setQuantity(1); 
    };

    const handleAddService = () => {
      if (category && selectedService) {
        const service = serviceData[category].find(
          (s) => s.name === selectedService
        );
        onAddService({
          category,
          name: service.name,
          price: service.price,
          quantity,
        });
      }
    };

    return (
      <div className="grid gap-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-300 w-[31%]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Receipt className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Bill ID</p>
              <p className="text-sm font-semibold text-gray-900">{billId}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-10 gap-1">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Service Type<span className="text-red-500">*</span>
            </label>
            <select
              className="w-[24rem] p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                transition-all duration-200"
              value={category}
              onChange={handleServiceTypeChange}
            >
              <option value="">Select Service Type</option>
              {Object.keys(serviceData).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Service<span className="text-red-500">*</span>
            </label>
            <select
              className="w-[24rem] p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                transition-all duration-200"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={!category}
            >
              <option value="">Select Service</option>
              {category &&
                serviceData[category].map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
            </select>
          </div>
                <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Quantity<span className="text-red-500">*</span>
          </label>
          <select
            className="w-[24rem] p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
              transition-all duration-200"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        </div>



        <div className="mt-3 flex justify-end">
          <button
            onClick={handleAddService}
            disabled={!category || !selectedService || quantity <= 0}
            className="group relative px-6 py-3 bg-gradient-to-r from-[#64C6B0] to-[#509f8e] rounded-lg font-medium text-white transition-all duration-300 hover:from-[#5cbaa6] hover:to-[#4a9a89] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Add Service</span>
            </span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#64C6B0]/50 to-[#509f8e]/50 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    );
  };

  export default ServiceDropdown;
