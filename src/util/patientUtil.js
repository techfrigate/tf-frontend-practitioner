import { format, parseISO } from "date-fns";

export const formatDateRange = (startDateTime, endDateTime) => {
  const startDate = new Date(startDateTime);
  const formattedDate = format(startDate, "MMMM dd, yyyy");
  const startTime = formatTime(startDateTime);
  const endTime = formatTime(endDateTime);
  return {
    date: formattedDate,
    timeRange: `${startTime}–${endTime}`,
  };
};

const formatTime = (dateString) => {
  const utcDate = parseISO(dateString);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );
  return format(localDate, "hh:mm a");
};

export const initialStatuses = [
  { display: "Scheduled", key: "scheduled" },
  { display: "Checked In", key: "checkedIn" },
  { display: "Checked Out", key: "checkedOut" },
  { display: "Closed", key: "closed" },
];
export const statusColors = {
  Scheduled: "bg-purple-100 text-purple-800",
  "Checked In": "bg-green-100 text-green-800",
  "Checked Out": "bg-yellow-100 text-yellow-800",
  Closed: "bg-red-100 text-red-800",
};


export const allowedTransitions = {
  Scheduled: ["Checked In"],
  "Checked In": ["Checked Out"],
  "Checked Out": ["Closed"],
  Closed: [],
};

export function calculateAge(dobString) {
  const dobYear = new Date(dobString).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - dobYear;
}