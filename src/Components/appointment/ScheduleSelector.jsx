import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { format, isToday, parseISO } from "date-fns";

const ScheduleSelector = ({ selectedDoctor, consultationType, handleDateSelect, selectedDate, currentIndex, handleArrowClick }) => {
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
    <div className="mt-8 w-full max-w-lg bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">
        Select Schedule
      </h2>
      <div className="flex items-center justify-center gap-2">
        <FaAngleLeft
          size={24}
          color="gray"
          className={`cursor-pointer transition-opacity duration-300 ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-75"
          }`}
          onClick={() => handleArrowClick("left")}
        />
        <div className="flex justify-around w-full px-4">
          {selectedDoctor.slots.map((item, index) => (
            (item.visitType === "both" || item.visitType === consultationType) && (
              <div
                key={index}
                className={`rounded-md px-4 py-2 mb-2 ml-4 cursor-pointer transition-colors duration-200 ${
                  selectedDate.startDate === item.startDate
                    ? "bg-[#00A182] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleDateSelect({ startDate: item.startDate, slotId: item._id })}
                style={{ boxShadow: "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em" }}
              >
                <p className="text-center">{formatWeek(item.startDate)}</p>
                <p className="text-center">{formatDate(item.startDate)}</p>
              </div>
            )
          ))}
        </div>
        <FaAngleRight
          size={24}
          color="gray"
          className={`cursor-pointer transition-opacity duration-300 ${
            currentIndex === selectedDoctor.slots.length - 5
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-75"
          }`}
          onClick={() => handleArrowClick("right")}
        />
      </div>
      {selectedDate && (
        <h2 className="text-lg font-semibold text-gray-500 mt-6 text-center">
          Selected Date: {formatWeek(selectedDate?.startDate)}, {formatDate(selectedDate?.startDate)}
        </h2>
      )}
    </div>
  );
};

export default ScheduleSelector;
