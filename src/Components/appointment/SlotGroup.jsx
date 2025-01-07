import React from "react";
import Slot from "./Slot";

const SlotGroup = ({ title, slots, selectedTimeSlot, handleTimeSlotSelect }) => {
  return (
    <div className="mb-6">
      <h1 className="text-md font-semibold text-gray-600 mb-3">{title}</h1>
      <div className="flex flex-wrap gap-3">
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
