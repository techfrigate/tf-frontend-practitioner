import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const PatientsttrHeader = (
  <tr className="text-white text-left">
    <th className="py-4 px-6">
      Patient
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
    <th className="py-4 px-6">UHID</th>
    <th className="py-4 px-6">
      Status
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>   
    <th className="py-4 px-6">DOB</th>
    <th className="py-4 px-6">
      Last Visit <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
    <th className="py-4 px-6">Phone</th>
  </tr>
);
export default PatientsttrHeader;
