import React from "react";
import { IoArrowUpSharp } from "react-icons/io5";

const WorkListtrHeader = (
  <tr className="text-white text-left">
    <th className="py-4 px-6">
      ID
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
    <th className="py-4 px-6">Title</th>
    <th className="py-4 px-6">Type</th>
    <th className="py-4 px-6">Assignee</th>
    <th className="py-4 px-6">Status</th>
    <th className="py-4 px-6">Labels</th>
    <th className="py-4 px-6">
      Due Date
      <IoArrowUpSharp className="inline ml-1" size={16} />
    </th>
  </tr>
);
export default WorkListtrHeader;
