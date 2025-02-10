import React from "react";
import { format, isToday, parseISO } from "date-fns";

const ScheduleSelector = ({
  selectedDoctor,
  consultationType,
  handleDateSelect,
  selectedDate,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = parseISO(dateString);
    return format(date, "dd MMM");
  };

  const formatWeek = (dateString) => {
    if (!dateString) return "";
    const date = parseISO(dateString);

    if (isToday(date)) {
      return "Today";
    }

    return format(date, "eee");
  };
 
  return (
    <div
      style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      className="mt-4 w-full max-w-lg bg-white rounded-lg p-4"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Select Schedule
      </h2>
      <div className="flex items-center gap-2">
        {/* Slot List */}
        <div className="flex overflow-x-auto gap-2">
          {selectedDoctor.slots.map(
            (item, index) =>
              (item.visitType === "Both" ||
                item.visitType === consultationType) && (
                <div
                  key={index}
                  className={`w-24 h-20 flex-shrink-0 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedDate.startDate === item.startDate
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 text-gray-800"
                  }`}
                  onClick={() =>
                    handleDateSelect({
                      startDate: item.startDate,
                      slotId: item._id,
                    })
                  }
                >
                  <p className="font-medium">{formatWeek(item.startDate)}</p>
                  <p className="font-semibold">{formatDate(item.startDate)}</p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelector;
