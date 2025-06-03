import { formatDateRange } from "../../util/patientUtil.js";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../Components/ui/avatar";
import { CustomTooltip } from "../../Components/Common/CustomTooltip";
import { Badge } from "../../Components/ui/badge";
import { Video, Phone, Calendar, Clock } from "lucide-react";
import { calculateAge } from "../../util/patientUtil.js";
import PatientModal from "./PatientModal.jsx"
import { Flame } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PatientColumn = ({ patient, setChannelName, setStatus, setCurrentPatientId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { date, timeRange } = formatDateRange(patient.startDateTime, patient.endDateTime);

  const onTaskDragStart = (event, patientId) => {
    event.dataTransfer.setData("text/plain", patientId.toString());
  };

  const navigate = useNavigate();
  const handleFlameClick = () => {
  // const patientId = patient._id;
  // const tenantId = patient.patientData?.tenants[0].tenantId; 
  // if (patientId && tenantId) {
    // navigate(`/fhirdetails/pid=${patientId}/tid=${tenantId}`);
    navigate(`/fhirdetails`);
  // }
}

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

    if (status === "Checked In") {
      setChannelName(patient.channelName.slice(0, 16));
      setStatus(status);
      setCurrentPatientId(patient._id);
      console.log("Starting video call for patient:", patient._id); 
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <div
        key={patient._id}
        className="py-2 mb-1 "
        draggable
        onDragStart={(event) => onTaskDragStart(event, patient._id)}
      >
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[30rem] overflow-hidden hover:bg-gray-50 transition-all">
          <div className="px-4 py-3">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-gray-200">
                <AvatarImage src={patient?.patientData?.imageUrl} />
                <AvatarFallback>
                  {patient?.patientData?.firstName.charAt(0) + " " + patient?.patientData?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {`${patient?.patientData?.firstName} ${patient?.patientData?.lastName}`}
                </h1>
                <p className="text-gray-600 text-sm">{`${calculateAge(patient?.patientData?.dob)}Y | ${patient?.patientData?.gender?.charAt(0).toUpperCase()}`}</p>
                <div className="flex items-center space-x-2 mt-1 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{patient?.patientData?.phoneNumber?.dialCode + patient?.patientData?.phoneNumber?.value || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{timeRange}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="forestLight">{patient.visitType}</Badge>
                {patient?.bookingStatus?.checkIn &&
                  !patient.bookingStatus?.checkOut &&
                  !patient?.bookingStatus?.closed && patient.visitType === "Online" && (
                    <>
                    <div className=" flex items-center justify-between gap-4">
                      <CustomTooltip content={`fhir-details`}>
                  <Flame 
                  className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                      size={22}     onClick={handleFlameClick}/>                    
                    </CustomTooltip>
                    <CustomTooltip content={`Video call`}>
                      <Video className="text-green-500 hover:text-green-600 transition-colors cursor-pointer" size={22} 
                        onClick={() => handleTaskClick(patient)}/>
                    </CustomTooltip>
                    </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <PatientModal
        patient={patient}
        doctor={patient.practitionerData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </>
  );
};

export default PatientColumn;