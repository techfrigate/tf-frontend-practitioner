import { ArrowUp } from "lucide-react";
import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const PatientsttrHeader = ({sortBy, setSortBy, setOrder, order})=>{
  

  function handleSortClick(field){
    if(sortBy===field){
      setOrder(order === "asc" ? "desc" : "asc")
    }else{
      setSortBy(field);
      setOrder("desc");
    }
  }
    
    
    function returnSortIcon(field){
      if(field===sortBy){
        return (
          <ArrowUp
      className={`inline ml-1 transform transition-transform duration-300 ${
       order === "desc" ? "rotate-180" : ""
      }`} 
      size={16} 
    />
        )
      }
     return <ArrowUp 
      className={`inline ml-1 transform transition-transform duration-300`} 
      size={16} 
    />
    }
  
  
  
  
  return (
  <tr className="text-white text-left">
    <th className="py-4 px-6 cursor-pointer" onClick={() => handleSortClick("firstName")}>
      Patient
    {returnSortIcon("firstName")}
    </th>
    <th className="py-4 px-6">UHID</th>
    <th className="py-4 px-6">
      Status
     
    </th>   
    <th className="py-4 px-6">DOB</th>
    <th className="py-4 px-6 cursor-pointer" onClick={() => handleSortClick("createdAt")}>
      Created At 
       {returnSortIcon("createdAt")}
    </th>
    <th className="py-4 px-6">Phone</th>
    <th className="py-4 px-6">Edit</th>
    <th className="py-4 px-6">Toggle Status</th>
  </tr>
);
}
export default PatientsttrHeader;
