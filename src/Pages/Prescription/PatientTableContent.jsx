import React from "react";
import { CustomTooltip } from "../../Components/Common/CustomTooltip";
import { format, parseISO } from "date-fns";
import { Badge } from "../../Components/ui/badge";
import { Video } from "lucide-react";
import GlobalTable from "../../Components/Common/GlobalTable";
import { TableCell, TableRow } from "../../Components/ui/table";

function PatientTableContent({ patients ,setChannelName ,setStatus }) {
  const formatTime = (dateString) => {
    const utcDate = parseISO(dateString);
    const localDate = new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
    );
    return format(localDate, "hh:mm a");
  };
  const formatDateRange = (startDateTime, endDateTime) => {
    const startDate = new Date(startDateTime);
    const formattedDate = format(startDate, "MMMM dd, yyyy");
    const startTime = formatTime(startDateTime);
    const endTime = formatTime(endDateTime);
    return {
      date: formattedDate,
      timeRange: `${startTime}–${endTime}`,
    };
  };

  const tableHeaders = [
    "Patient Name",
    "Age & Gender",
    "Team",
    "Appointment Time",
    "Status",
    "Type",
    "Actions",
  ];

  const handleTaskClick = (patient) => {
    const { bookingStatus } = patient;
 
    let status = "Scheduled"; 
    if (bookingStatus.booked && bookingStatus.checkIn && bookingStatus.checkOut && bookingStatus.closed) {
      status = "Closed";
    } else if (bookingStatus.booked && bookingStatus.checkIn && bookingStatus.checkOut) {
      status = "Checked Out";
    } else if (bookingStatus.booked && bookingStatus.checkIn) {
      status = "Checked In";
    } else if (bookingStatus.booked) {
      status = "Scheduled";
    }
   if(status === "Checked In"){
    setChannelName((patient.channelName).slice(0, 16));
    setStatus(status);
   }
     
  };
 


  return (
    <GlobalTable headers={tableHeaders}>
      {patients.length > 0 ? (
        patients.map((patient, index) => {
          const { date, timeRange } = formatDateRange(
            patient.startDateTime,
            patient.endDateTime
          );

          return (
            <TableRow key={index} className={`text-center`}>
              <TableCell>
                {`${patient.practitionerData.firstName} ${patient.practitionerData.lastName}`}
              </TableCell>
              <TableCell>{`34Y | M`}</TableCell>
              <TableCell>{`Medical`}</TableCell>

              <TableCell>
                {date}, {timeRange}
              </TableCell>
              <TableCell
                className={`${
                  patient.bookingStatus.closed
                    ? "text-red-500"
                    : patient.bookingStatus.checkOut
                    ? "text-yellow-500"
                    : patient.bookingStatus.checkIn
                    ? "text-green-500"
                    : "text-purple-500"
                }`}
              >
                {patient.bookingStatus.closed
                  ? "Closed"
                  : patient.bookingStatus.checkOut
                  ? "Checked Out"
                  : patient.bookingStatus.checkIn
                  ? "Checked In"
                  : "Scheduled"}
              </TableCell>
              <TableCell>
                <Badge variant="forestLight">Appointment</Badge>
              </TableCell>
              <TableCell className="flex items-center justify-center gap-2 " onClick={() => handleTaskClick(patient)}>
              {patient?.bookingStatus?.checkIn && !patient.bookingStatus?.checkOut && !patient?.bookingStatus?.closed && 
                <CustomTooltip content={`Video call`}>
                  <Video
                    className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                    size={20}
                  />
                </CustomTooltip>
              }
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan="5"
            className="py-4 text-center text-gray-500 text-sm"
          >
            No patients found.
          </TableCell>
        </TableRow>
      )}
    </GlobalTable>
  );
}

export default PatientTableContent;
