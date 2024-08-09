import React from "react";
import { format, parseISO } from "date-fns";

const Slot = ({ time, selectedTimeSlot, handleTimeSlotSelect }) => {
  const formatTime = (dateString) => {
    const utcDate = parseISO(dateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return format(localDate, 'hh:mm a');
  };

  return (
    <div
      className={`rounded-md px-4 py-2 mb-2 cursor-pointer transition-colors duration-200 ${
        selectedTimeSlot?.startDateTime === time.startDateTime
          ? "bg-[#00A182] text-white"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
      }`}
      onClick={() => handleTimeSlotSelect(time)}
    >
      <p className="text-center">{`${formatTime(time.startDateTime)} - ${formatTime(time.endDateTime)}`}</p>
    </div>
  );
};

export default Slot;
