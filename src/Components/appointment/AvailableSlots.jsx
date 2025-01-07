import React from "react";
import SlotGroup from "./SlotGroup";

const AvailableSlots = ({ morningSlots, afternoonSlots, eveningSlots, selectedTimeSlot, handleTimeSlotSelect }) => {
  return (
    <div className="pl-3 mt-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Available Slots
      </h2>
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
  );
};

export default AvailableSlots;
