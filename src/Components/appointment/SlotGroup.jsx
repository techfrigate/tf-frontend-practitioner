import React from "react";
import Slot from "./Slot";

const SlotGroup = ({ title, slots, selectedTimeSlot, handleTimeSlotSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">{title}</h1>
      <div className="flex flex-wrap gap-2">
        {slots.map((time, index) => (
          <Slot
            key={index}
            time={time}
            selectedTimeSlot={selectedTimeSlot}
            handleTimeSlotSelect={handleTimeSlotSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default SlotGroup;
