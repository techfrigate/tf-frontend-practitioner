import React from "react";
import { format, parseISO } from "date-fns";

const Slot = ({ time, selectedTimeSlot, handleTimeSlotSelect }) => {
  const formatTime = (dateString) => {
    const utcDate = parseISO(dateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return format(localDate, "hh:mm a");
  };

  const isBooked = time.status === "booked";

  return (
    <div
      className={`rounded-sm px-6 py-1 mb-2 cursor-pointer transition-colors duration-200 border-2 ${
        isBooked
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : selectedTimeSlot?.startDateTime === time.startDateTime
          ? "bg-gray-200 border-gray-700"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
      }`}
      onClick={!isBooked ? () => handleTimeSlotSelect(time) : null}
    >
      <p
        className={`text-center ${
          isBooked ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {`${formatTime(time.startDateTime)} - ${formatTime(time.endDateTime)}`}
      </p>
    </div>
  );
};

export default Slot;
