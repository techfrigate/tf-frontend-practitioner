import React, { useState } from "react";
import { data } from "./WorkListData";

const WorkListTd = ({ offset, itemsPerPage, handlePrescription }) => {
  return (
    <>
      {data.slice(offset, offset + itemsPerPage).map((item) => (
        <tr
          key={item.id}
          className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer "
        >
          <td className="py-4 px-4 text-nowrap text-xs">{item.id}</td>
          <td className="py-4 px-4 flex flex-col gap-1 text-xs text-nowrap">
            {item.title}
            <span className="text-xs text-gray-500">{item.time}</span>
          </td>
          <td
            onClick={() => handlePrescription(item)}
            className="py-4 px-4 text-nowrap text-xs"
          >
            {item.type}
          </td>
          <td className="py-4 px-4 text-nowrap text-xs">
            <div className="flex gap-2 items-center">
              <div className="bg-[#1e817e] w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-sm">
                PK
              </div>
              <span>{item.assignee}</span>
            </div>
          </td>
          <td className="py-4 px-4">
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                item.status === "Cancelled"
                  ? "bg-red-100 text-red-900"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {item.status}
            </span>
          </td>
          <td className="py-4 px-4 text-nowrap text-xs">
            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-900">
              {item.labels}
            </span>
          </td>
          <td className="py-4 px-4 text-nowrap text-xs">{item.dueDate}</td>
        </tr>
      ))}
    </>
  );
};

export default WorkListTd;
