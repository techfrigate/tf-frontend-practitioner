import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const BillingtrHeader = (
  <tr className="text-white">
    <th className="py-4 px-6 text-left">
      Patient
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
    <th className="py-4 px-6 text-left">UHID</th>
    <th className="py-4 px-6 text-left">Bill ID</th>
    <th className="py-4 px-6 text-left">Status</th>
    <th className="py-4 px-6 text-left">Last Visit</th>
    <th className="py-4 px-6 text-left">Bill</th>
    <th></th>
  </tr>
);

export default BillingtrHeader;
