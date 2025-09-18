import React, { useState } from "react";
import { State, City, Country } from "../../util/data";
import CustomInput from "../../Components/Common/CustomInput";
import CustomSelect from "../../Components/Common/CustomSelect";
import { MapPin } from "lucide-react";

const AddressInfo = ({ addressFormData, addressInfo, inValidObject,setAddressInfo,setInvalidObject }) => {
  const [stats, setStats] = useState(State);
  const [cities, setCities] = useState(City); 
 

  const handleAddressInfoChange = (e) => {
    let { name, value} = e.target;
    if (name === "zipCode") {
      value = value.replace(/[^0-9]/g, "").slice(0, 6);
    }
    setAddressInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setInvalidObject((pre) => ({ ...pre, [name]: "" }));
    if(["country","city","state"].includes(name)){
      const selectedOption  =  e.target?.selectedOptions[0]
      if(name==="country"){
        // eslint-disable-next-line
        const updatedStats =  State.filter((elm)=>elm.country_id==selectedOption.id)
        setStats(updatedStats)
      }else if(name==="state"){
        // eslint-disable-next-line
        const updatedCities =  City.filter((elm)=>elm.state_id==selectedOption.id)
      setCities(updatedCities)
      }
    }
  };
 
  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-2 border-b pb-2 mb-4">
      <MapPin className="w-5 h-5 text-[#64c6b0]" />
      <h1 className="text-sm font-semibold text-[#1e817e]">ADDRESS INFORMATION</h1>
    </div>
    <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
      {addressFormData?.map((elem) => {
        if (["country", "state", "city"].includes(elem.id)) {
          return (
            <CustomSelect
              key={elem.id}
              id={elem.id}
              label={elem.label}
              value={addressInfo[elem.id] || ""} 
              onChange={handleAddressInfoChange}
              options={elem.id === "country" ? Country : elem.id === 'state' ? stats : cities || []}
              isInvalid={inValidObject[elem.id]}
              required={elem.required}
            />
          );
        } else {
          return (
            <CustomInput
              key={elem.id}
              type={elem.type}
              label={elem.label}
              id={elem.id}
              placeholder={elem.placeholder}
              value={addressInfo[elem.id]} 
              onChange={handleAddressInfoChange}
              isInvalid={inValidObject[elem.id]}
              required={elem.required}
            />
          );
        }
      })}
    </div>
  </div>
  );
};

export default AddressInfo;
