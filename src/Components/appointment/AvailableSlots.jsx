import React from "react";
import SlotGroup from "./SlotGroup";

const AvailableSlots = ({ morningSlots, afternoonSlots, eveningSlots, selectedTimeSlot, handleTimeSlotSelect }) => {
  return (
    <div className="pl-3">
      <h2 className="text-lg font-semibold text-gray-500 mt-6">
        Available Slots
      </h2>
      <div className="w-full flex gap-3">
        {morningSlots.length > 0 && (
          <SlotGroup
            title="Morning Slots"
            slots={morningSlots}
            selectedTimeSlot={selectedTimeSlot}
            handleTimeSlotSelect={handleTimeSlotSelect}
          />
        )}
        {afternoonSlots.length > 0 && (
          <SlotGroup
            title="Afternoon Slots"
            slots={afternoonSlots}
            selectedTimeSlot={selectedTimeSlot}
            handleTimeSlotSelect={handleTimeSlotSelect}
          />
        )}
        {eveningSlots.length > 0 && (
          <SlotGroup
            title="Evening Slots"
            slots={eveningSlots}
            selectedTimeSlot={selectedTimeSlot}
            handleTimeSlotSelect={handleTimeSlotSelect}
          />
        )}
      </div>
    </div>
  );
};

export default AvailableSlots;
