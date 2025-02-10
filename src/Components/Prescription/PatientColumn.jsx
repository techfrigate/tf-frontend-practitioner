import { formatDateRange } from "../../util/patientUtil.js";
import React from 'react'
import {Avatar,AvatarImage,AvatarFallback,} from "../../Components/ui/avatar";
import { CustomTooltip } from "../../Components/Common/CustomTooltip";
import { Badge } from "../../Components/ui/badge";
import { Video } from "lucide-react";
const PatientColumn = ({patient,setChannelName,setStatus}) => {
  const { date, timeRange } = formatDateRange(
    patient.startDateTime,
    patient.endDateTime
  );
  const onTaskDragStart = (event, patientId) => {
    event.dataTransfer.setData("text/plain", patientId.toString());
  };


  const handleTaskClick = (patient) => {
    const { bookingStatus } = patient;
 
    let status = "Scheduled"; // Default status
  
    // Determine the status based on the bookingStatus flags
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
    <div
    key={patient._id}
    className="bg-white p-4 mb-1 rounded-lg cursor-pointer shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
    draggable
    onDragStart={(event) =>
      onTaskDragStart(event, patient._id)
    }
    onClick={() => handleTaskClick(patient)}
  >
    <div className="flex items-center space-x-4 mb-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={patient.profileImage} />
        <AvatarFallback>PV</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-600">
          {`${patient.practitionerData.firstName} ${patient.practitionerData.lastName}`}
        </h3>
        <p className="text-xs text-gray-500">34Y | F</p>
      </div>
    </div>
    <div>
      <p className="text-xs text-gray-400">{date}</p>{" "}
      <p className="text-xs text-gray-400">{timeRange}</p>{" "}
    </div>
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm ">
      <Badge variant="forestLight">Appointment</Badge>
       {patient?.bookingStatus?.checkIn && !patient.bookingStatus?.checkOut && !patient?.bookingStatus?.closed && <CustomTooltip content={`Video call`}> 
      <Video
        className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
        size={20}
      />
      </CustomTooltip>
       }
    </div>
  </div>
  )
}

export default PatientColumn