import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const MedicinestrHeader = (
  <tr className="text-white">
    <th className="py-4 px-6 text-left">
        Pharmacy Name
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
    <th className="py-4 px-6 text-left">location</th>
    <th className="py-4 px-6 text-left">Medicine Name</th>
    <th className="py-4 px-6 text-left">Manufactured By</th>
    <th className="py-4 px-6 text-left">Expiry Date</th>
    <th className="py-4 px-6 text-left">Price</th>
    <th className="py-4 px-6 text-left">Unit</th>
    <th></th>
  </tr>
);

export default MedicinestrHeader;
