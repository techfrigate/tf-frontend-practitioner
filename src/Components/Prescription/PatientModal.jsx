import React, { useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../Components/ui/avatar";
import { Calendar, Clock, Phone, FileText } from "lucide-react";
import { formatDateRange, calculateAge } from "../../util/patientUtil.js";

const PatientModal = ({ patient, isOpen, onClose, doctor }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { date, timeRange } = formatDateRange(patient.startDateTime, patient.endDateTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-100">
          <p className="text-yellow-700 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please arrive 15 minutes before your scheduled appointment time.
          </p>
        </div>
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Patient Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 border-2 border-gray-200">
              <AvatarImage src={patient?.patientData?.imageUrl} />
              <AvatarFallback>
                {patient?.patientData?.firstName.charAt(0) + " " + patient?.patientData?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {`${patient?.patientData?.firstName} ${patient?.patientData?.lastName}`}
              </h4>
              <p className="text-gray-600">
                {`${calculateAge(patient?.patientData?.dob)} years | ${patient?.patientData?.gender?.charAt(0).toUpperCase()}`}
              </p>
              <div className="flex items-center space-x-2 mt-1 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{patient?.patientData?.phoneNumber?.dialCode + patient?.patientData?.phoneNumber?.value || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Doctor Information</h3>
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 border border-gray-200">
              <AvatarImage src={doctor?.imageUrl} />
              <AvatarFallback>
                {doctor?.firstName ? doctor.firstName.charAt(0) : "D"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-800">
                {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Doctor not assigned"}
              </h4>
              <p className="text-gray-600 text-sm">
                {doctor.work?.designation || ""}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Appointment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{timeRange}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Visit Type</p>
                <p className="font-medium">{patient.visitType}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;