import React from "react";
import Slot from "./Slot";
import { format, parseISO } from "date-fns";
const formatTime = (dateString) => {
  const utcDate = parseISO(dateString);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );
  return format(localDate, "hh:mm a");
};
const SlotGroup = ({title,slots,selectedTimeSlot,handleTimeSlotSelect}) => {
return (
  <div className="mb-6">
    <h1 className="text-md font-semibold text-gray-600 mb-3">{title}</h1>  
    <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
      <div className="flex gap-3">
        {slots.map((time, index) => (
          <div
            key={index}
            className={`rounded-sm px-6 py-1 mb-2 transition-colors duration-200 border-2
              ${
                time.status === "booked"
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : selectedTimeSlot?.startDateTime === time.startDateTime
                  ? "bg-gray-200 border-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 cursor-pointer"
              }`}
            onClick={
              !(time.status === "booked") ? () => handleTimeSlotSelect(time) : null
            }
          >
            <p className="text-center text-sm font-semibold">
              {`${formatTime(time.startDateTime)} - ${formatTime(time.endDateTime)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default SlotGroup;
