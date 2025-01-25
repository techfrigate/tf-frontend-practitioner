import React, { useState } from "react";
import {Zap,ReceiptText,Package,Stethoscope,Briefcase,Pill,} from "lucide-react";
import { Card, CardHeader, CardContent } from "../../Components/ui/card";
import IconCustomSelect from "../../Components/Common/IconCustomSelect";

const ServiceDropdown = ({ onAddService, billId, selectedLocation, billIdFromUrl, medicines }) => {
  const [category, setCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(0);

  const categoryIcons = {
    Packages: <Package className="w-5 h-5" />,
    Diagnostic: <Stethoscope className="w-5 h-5" />,
    Service: <Briefcase className="w-5 h-5" />,
    Medicine: <Pill className="w-5 h-5" />
  };

  const getServices = (category) => {
    if (!selectedLocation) return [];
    
    const serviceMap = {
      Packages: selectedLocation.packages,
      Diagnostic: selectedLocation.diagnostic,
      Service: selectedLocation.services,
      Medicine: medicines?.filter(med => 
        med.locationId === selectedLocation._id && med.sale !== "yes"
      )
    };

    return (serviceMap[category] || []).filter(item => item.status || category === "Medicine");
  };

  const handleServiceTypeChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSelectedService("");
    setQuantity(1);
    setMaxAvailableQuantity(0);
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setSelectedService(value);
    
    if (category === "Medicine") {
      const medicine = getServices(category).find(med => med._id === value);
      setMaxAvailableQuantity(medicine ? parseInt(medicine.unit) : 0);
    }
    
    setQuantity(1);
  };

  const handleAddService = () => {
    if (!category || !selectedService) return;

    const services = getServices(category);
    const serviceItem = services.find(item => 
      category === "Medicine" ? item._id === selectedService : 
      category === "Packages" ? item.packageName === selectedService : 
      item.name === selectedService
    );

    if (!serviceItem) return;

    const serviceData = {
      category,
      quantity,
      ...(category === "Medicine" ? {
        medicineId: serviceItem._id,
        name: serviceItem.medicineName,
        genericName: serviceItem.genericName,
        price: parseFloat(serviceItem.mrpPerUnit),
        gstPercentage: parseFloat(serviceItem.gstPercentage),
        maxQuantity: serviceItem.maxQuantity,
        currentStock: serviceItem.unit
      } : category === "Packages" ? {
        name: serviceItem.packageName,
        price: calculatePackagePrice(serviceItem),
        packageDetails: {
          diagnostics: serviceItem.diagnostics || [],
          services: serviceItem.services || []
        }
      } : {
        name: serviceItem.name,
        price: serviceItem.price
      })
    };

    onAddService(serviceData);
    setSelectedService("");
    setQuantity(1);
    setMaxAvailableQuantity(0);
  };

  const calculatePackagePrice = (package_) => {
    const diagnosticsTotal = (package_.diagnostics || []).reduce((sum, item) => 
      sum + (parseFloat(item.price) || 0), 0);
    const servicesTotal = (package_.services || []).reduce((sum, item) => 
      sum + (parseFloat(item.price) || 0), 0);
    return diagnosticsTotal + servicesTotal;
  };

  const getServiceOptions = () => {
    const services = getServices(category);
    return services.map(service => ({
      value: category === "Medicine" ? service._id : 
             category === "Packages" ? service.packageName : 
             service.name,
      label: category === "Medicine" ? 
             `${service.medicineName} (${service.unit} units available)` :
             category === "Packages" ? service.packageName : 
             service.name,
      icon: categoryIcons[category]
    }));
  };

  const categoryOptions = [
    { value: "", label: "Select Service Type", icon: null },
    ...Object.entries(categoryIcons).map(([value, icon]) => ({
      value,
      label: value,
      icon
    }))
  ];

  return (
    <Card className="w-full mx-auto bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add Services</h2>
          {billIdFromUrl && (
            <div className="flex items-center space-x-3 bg-gray-50 px-6 py-2 rounded-lg border border-gray-200">
              <ReceiptText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Bill ID</p>
                <p className="text-sm font-semibold text-gray-900">{billId}</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Service Type<span className="text-red-500">*</span>
              </label>
              <IconCustomSelect
                value={category}
                onChange={handleServiceTypeChange}
                options={categoryOptions}
                placeholder="Select Service Type"
                disabled={!selectedLocation}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {category || "Service"}<span className="text-red-500">*</span>
              </label>
              <IconCustomSelect
                value={selectedService}
                onChange={handleServiceChange}
                options={getServiceOptions()}
                placeholder={`Select ${category || "Service"}`}
                icon={categoryIcons[category]}
                disabled={!category}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) ;
                    setQuantity(category === "Medicine" 
                      ? Math.min(maxAvailableQuantity, newQuantity)
                      : newQuantity
                    );
                  }}
                  min="0"
                  max={category === "Medicine" ? maxAvailableQuantity : undefined}
                />
                {category === "Medicine" && maxAvailableQuantity > 0 && (
                  <p className="absolute -bottom-6 left-0 text-sm text-gray-500">
                    Max available: {maxAvailableQuantity} units
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={handleAddService}
              disabled={!category || !selectedService || quantity < 0}
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl 
                font-medium text-white shadow-lg shadow-emerald-200 
                transition-all duration-300 hover:shadow-emerald-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
              <span className="relative z-10 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Add {category || "Service"}</span>
              </span>
              <div className="absolute inset-0 rounded-xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDropdown;