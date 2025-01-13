import React, { useState, useEffect } from "react";
import { Zap, Receipt } from "lucide-react";

const ServiceDropdown = ({ onAddService, billId, selectedLocation, billIdFromUrl, medicines }) => {
  const [category, setCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [services, setServices] = useState([]);
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(0);

  useEffect(() => {
    console.log("Selected Location:", selectedLocation);
  }, [selectedLocation]);

  console.log(medicines)

  const handleServiceTypeChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSelectedService("");
    setQuantity(1);
    setMaxAvailableQuantity(0);

    if (selectedCategory && selectedLocation) {
      let locationServices = [];
      if (selectedCategory === "Packages" && Array.isArray(selectedLocation.packages)) {
        locationServices = selectedLocation.packages.filter(pkg => pkg.status);
      } else if (selectedCategory === "Diagnostic" && Array.isArray(selectedLocation.diagnostic)) {
        locationServices = selectedLocation.diagnostic.filter(service => service.status);
      } else if (selectedCategory === "Service" && Array.isArray(selectedLocation.services)) {
        locationServices = selectedLocation.services.filter(service => service.status);
      } else if (selectedCategory === "Medicine" && Array.isArray(medicines)) {
        locationServices = medicines.filter(
          medicine => medicine.locationId === selectedLocation._id && medicine.sale !== "yes"
        );
      }
      setServices(locationServices);
    } else {
      setServices([]);
    }
  };

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedService(selectedValue);
    setQuantity(1);

    if (category === "Medicine") {
      const medicine = services.find(med => med._id === selectedValue);
      if (medicine) {
        setMaxAvailableQuantity(parseInt(medicine.noOfUnit));
      }
    }
  };

  const calculatePackagePrice = (package_) => {
    let totalPrice = 0;
    if (Array.isArray(package_.diagnostics)) {
      totalPrice += package_.diagnostics.reduce((sum, diagnostic) => {
        return sum + (parseFloat(diagnostic.price) || 0);
      }, 0);
    }
    if (Array.isArray(package_.services)) {
      totalPrice += package_.services.reduce((sum, service) => {
        return sum + (parseFloat(service.price) || 0);
      }, 0);
    }
    return totalPrice;
  };

  const handleAddService = () => {
    if (!category || !selectedService) return;

    if (category === "Packages") {
      const package_ = services.find((pkg) => pkg.packageName === selectedService);
      if (package_) {
        const totalPrice = calculatePackagePrice(package_);
        onAddService({
          category,
          name: package_.packageName,
          price: totalPrice,
          quantity,
          packageDetails: {
            diagnostics: package_.diagnostics || [],
            services: package_.services || []
          }
        });
      }
    } else if (category === "Medicine") {
      const medicine = services.find((med) => med._id === selectedService);
      if (medicine) {
        onAddService({
          category,
          medicineId: medicine._id,
          name: medicine.medicineName,
          genericName: medicine.genericName,
          price: parseFloat(medicine.mrpPerUnit),
          quantity,
          gstPercentage: parseFloat(medicine.gstPercentage),
          maxQuantity: medicine.maxQuantity,
          currentStock: medicine.noOfUnit
        });
      }
    } else {
      const service = services.find((s) => s.name === selectedService);
      if (service) {
        onAddService({
          category,
          name: service.name,
          price: service.price,
          quantity,
        });
      }
    }
    setSelectedService("");
    setQuantity(1);
    setMaxAvailableQuantity(0);
  };

  const getServiceOptions = () => {
    if (category === "Medicine") {
      return services.map((medicine) => (
        <option key={medicine._id} value={medicine._id}>
          {medicine.medicineName} ({medicine.noOfUnit} units available)
        </option>
      ));
    } else if (category === "Packages") {
      return services.map((service) => (
        <option key={service._id} value={service.packageName}>
          {service.packageName}
        </option>
      ));
    } else {
      return services.map((service) => (
        <option key={service._id} value={service.name}>
          {service.name}
        </option>
      ));
    }
  };

  return (
    <div className="grid gap-4">
      {billIdFromUrl && (
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
      )}
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
            disabled={!selectedLocation}
          >
            <option value="">Select Service Type</option>
            {["Packages", "Diagnostic", "Service", "Medicine"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            {category === "Packages" ? "Package" : category === "Medicine" ? "Medicine" : "Service"}
            <span className="text-red-500">*</span>
          </label>
          <select
            className="w-[24rem] p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-all duration-200"
            value={selectedService}
            onChange={handleServiceChange}
            disabled={!category}
          >
            <option value="">
              Select {category === "Packages" ? "Package" : category === "Medicine" ? "Medicine" : "Service"}
            </option>
            {getServiceOptions()}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Quantity<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-[24rem] p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
              transition-all duration-200"
            value={quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value) || 0;
              if (category === "Medicine") {
                setQuantity(Math.min(maxAvailableQuantity, newQuantity));
              } else {
                setQuantity(newQuantity);
              }
            }}
            min="0"
            max={category === "Medicine" ? maxAvailableQuantity : undefined}
            step="1"
          />
          {category === "Medicine" && maxAvailableQuantity > 0 && (
            <p className="text-sm text-gray-500">
              Max available: {maxAvailableQuantity} units
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleAddService}
          disabled={!category || !selectedService || quantity < 0}
          className="group relative px-6 py-3 bg-gradient-to-r from-[#64C6B0] to-[#509f8e] rounded-lg font-medium text-white transition-all duration-300 hover:from-[#5cbaa6] hover:to-[#4a9a89] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Add {category === "Packages" ? "Package" : category === "Medicine" ? "Medicine" : "Service"}</span>
          </span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#64C6B0]/50 to-[#509f8e]/50 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default ServiceDropdown;