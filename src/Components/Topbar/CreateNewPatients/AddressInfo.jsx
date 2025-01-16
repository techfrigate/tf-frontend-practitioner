import React, { useState } from "react";
import CustomInput from "../../../Components/Common/CustomInput";
import CustomSelect from "../../../Components/Common/CustomSelect";
import { Country, State, City } from "../../../util/data";

const AddressInfo = ({ addressFormData, addressInfo, inValidObject,setAddressInfo }) => {
  const [stats, setStats] = useState(State);
  const [cities, setCities] = useState(City); 
  const [invalidObject, setInvalidObject] = useState(inValidObject);
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
      <div className="mb-4 border-b pb-2">
        <h1 className="text-sm font-semibold text-[#1e817e]">ADDRESS INFORMATION</h1>
      </div>
    <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
  {addressFormData?.map((elem) => {
    if (["country", "state", "city"].includes(elem.id)){
      return (
        <CustomSelect
          key={elem.id}
          id={elem.id}
          label={elem.label}
          value={addressInfo[elem.id] || ""} 
          onChange={handleAddressInfoChange}
          options={elem.id==="country"?Country:elem.id==='state'?stats:cities || []}
          isInvalid={invalidObject[elem.id]}
        />
      );
    }else{
      return (
        <CustomInput
          key={elem.id}
          type={elem.type}
          label={elem.label}
          id={elem.id}
          placeholder={elem.placeholder}
          value={addressInfo[elem.id]} 
          onChange={handleAddressInfoChange}
          isInvalid={invalidObject[elem.id]}
        />
      );
    }
  
  })}
</div>
    </div>
  );
};

export default AddressInfo;
