import React, { useEffect, useRef } from "react";
import { FaCalendarPlus, FaUserInjured } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoBody } from "react-icons/io5";

const CreateNewModal = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const modalRef = useRef(null);

  return (
    <div
      ref={modalRef}
      className="absolute z-40 top-12 right-0 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
    >
      <div className="flex flex-col space-y-1 text-gray-600 text-sm">
        <div
          onClick={() => {
            navigate("/appointments/new");
            onClose();
          }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <FaCalendarPlus size={16} />
          <p>Appointment</p>
        </div>
        <div
          onClick={() => {
            navigate("/new-patient");
            onClose();
          }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <FaUserInjured size={16} />
          <p>Patient</p>
        </div>
        <div
          onClick={() => {
            navigate("/humanbody");
            onClose();
          }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <IoBody size={16} />
          <p>Human Body</p>
        </div>
      </div>
    </div>
  );
};

export default CreateNewModal;
