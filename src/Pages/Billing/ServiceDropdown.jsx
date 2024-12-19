import React, { useState,useEffect } from "react";
import { serviceData } from "./billingdata";
import CustomButton from "../../Components/Common/CustomButton";

const ServiceDropdown = ({ onAddService }) => {
  const [serviceType, setServiceType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [billId, setBillId] = useState("");

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
    setSelectedService("");
  };

  useEffect(() => {
    const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedBillId = `BILL ID - ${randomLetters}${Date.now()}`;
    setBillId(generatedBillId);
  }, []);

  const handleAddService = () => {
    if (serviceType && selectedService) {
      const service = serviceData[serviceType].find(
        (s) => s.name === selectedService
      );
      onAddService({
        billId,
        serviceType,
        name: service.name,
        rate: service.rate,
        amount: service.rate,
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="col-span-3">
        <div className="w-full p-2  rounded text-left">
          {billId}
        </div>
      </div>
      <div>
        
        <label className="block text-gray-700 text-sm mb-1">
          Service Type*
        </label>
        <select
          className="w-full p-2 border rounded"
          value={serviceType}
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

      <div>
        <label className="block text-gray-700 text-sm mb-1">Service*</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          disabled={!serviceType}
        >
          <option value="">Select Service</option>
          {serviceType &&
            serviceData[serviceType].map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
        </select>
      </div>

      <div className="col-span-3 text-right">
        <CustomButton text="Add Service" onclick={handleAddService} />
      </div>
    </div>
  );
};

export default ServiceDropdown;
