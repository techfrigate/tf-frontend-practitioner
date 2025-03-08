import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const MedicinestrHeader =({setSortBy,sortBy,setOrder,order})=>{


function handleSortClick(field){
if(field===sortBy){
  setOrder(order === "asc" ? "desc" : "asc")
}else{
  setSortBy(field);
  setOrder("asc");
}
}

  return (
    <tr className="text-white">
      <th className="py-4 px-6 text-left cursor-pointer" onClick={()=>handleSortClick("pharmacyName")}>
          Pharmacy Name
        <IoArrowUpSharp className={`inline ml-1 transform transition-transform duration-300 ${order === "desc" ? "rotate-180" : ""}`} size={16} />
      </th>
      <th className="py-4 px-6 text-left">location</th>
      <th className="py-4 px-6 text-left">Medicine Name</th>
      <th className="py-4 px-6 text-left">Manufactured By</th>
      <th className="py-4 px-6 text-left">Expiry Date</th>
      <th className="py-4 px-6 text-left">Price</th>
      <th className="py-4 px-6 text-left">Unit</th>
      <th className="py-4 px-6 text-left">Edit</th>

      <th></th>
    </tr>
  );
} 

export default MedicinestrHeader;
