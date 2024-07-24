import React, { useState } from "react";
import { FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    experience: "10 years",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Dermatologist",
    experience: "8 years",
    image:
      "https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg=",
  },
  {
    id: 3,
    name: "Dr. Alice Johnson",
    specialty: "Pediatrician",
    experience: "12 years",
    image: "https://s3.envato.com/files/354413107/2072.jpg",
  },
];

// Dummy data for patients
const patients = [
  {
    id: 1,
    name: "Alice Brown",
    age: 25,
    image: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
  },
  {
    id: 2,
    name: "Bob Green",
    age: 30,
    image: "https://t3.ftcdn.net/jpg/01/42/01/84/360_F_142018449_yR0avsaJqbIx8NA47sINMoaxdtn1sPzh.jpg",
  },
  {
    id: 3,
    name: "Charlie Black",
    age: 28,
    image: "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg",
  },
];

const initialSchedule = [
  { day: "Today", date: "12 Aug" },
  { day: "Mon", date: "13 Aug" },
  { day: "Tue", date: "14 Aug" },
  { day: "Wed", date: "15 Aug" },
  { day: "Thu", date: "16 Aug" },
  { day: "Fri", date: "17 Aug" },
  { day: "Sat", date: "18 Aug" },
  { day: "Sun", date: "19 Aug" },
  { day: "Mon", date: "20 Aug" },
  { day: "Tue", date: "21 Aug" },
  { day: "Wed", date: "22 Aug" },
  { day: "Thu", date: "23 Aug" },
  { day: "Fri", date: "24 Aug" },
  { day: "Sat", date: "25 Aug" },
  { day: "Sun", date: "26 Aug" },
  { day: "Mon", date: "27 Aug" },
  { day: "Tue", date: "28 Aug" },
  { day: "Wed", date: "29 Aug" },
  { day: "Thu", date: "30 Aug" },
  { day: "Fri", date: "31 Aug" },
];

const timeSlots = [
  "11:15AM",
  "12:30PM",
  "01:30PM",
  "02:30PM",
  "03:00PM",
  "04:30PM",
  "05:30PM",
];

const Appointment = () => {
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationType, setConsultationType] = useState("inperson");
  const [price, setPrice] = useState(100);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(initialSchedule[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);

  const handleDoctorSearch = (e) => {
    setSearchDoctor(e.target.value);
    if (e.target.value.length > 0) {
      const results = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredDoctors(results);
    } else {
      setFilteredDoctors([]);
    }
  };

  const handlePatientSearch = (e) => {
    setSearchPatient(e.target.value);
    if (e.target.value.length > 0) {
      const results = patients.filter((pat) =>
        pat.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredPatients(results);
    } else {
      setFilteredPatients([]);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFilteredDoctors([]);
    setSearchDoctor(`${doctor.name} - ${doctor.specialty}`);
  };;

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFilteredPatients([]);
    setSearchPatient(patient.name);
  };

  const handleConsultationChange = (type) => {
    setConsultationType(type);
    if (type === "inperson") {
      setPrice(500); // Price for in-person consultation
    } else {
      setPrice(300); // Price for online consultation
    }
  };

  const handleArrowClick = (direction) => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < schedule.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  return (
    <div className="pt-1">
      <div className="border-2 border-[#ecf7f4] shadow-lg m-3 rounded-lg pb-4 p-4 bg-gray-50 customScrollbar h-[80vh]">
        <h1
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          className="text-xl font-semibold mb-6 text-[#00A182] p-3 rounded-md bg-white"
        >
          New Appointment
        </h1>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto">
          <div className="relative w-full">
            <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#00A182]" />
            <input
              type="text"
              placeholder="Search Doctor.."
              value={searchDoctor}
              onChange={handleDoctorSearch}
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A182] transition duration-300 ease-in-out"
            />
            {filteredDoctors.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
                {filteredDoctors.map((doctor) => (
                  <li
                    key={doctor.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div>
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-[50px] h-[50px] rounded-full mr-3"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {doctor.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {doctor.specialty}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {doctor.experience} experience
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-full">
            <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#00A182]" />
            <input
              type="text"
              placeholder="Search Patient.."
              value={searchPatient}
              onChange={handlePatientSearch}
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A182] transition duration-300 ease-in-out"
            />
            {filteredPatients.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center">
                      <img
                        src={patient.image}
                        alt={patient.name}
                        className="w-[50px] h-[50px] rounded-full mr-3"
                      />
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {patient.name}
                        </p>
                        <p className="text-gray-500 text-sm">Age: {patient.age}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {selectedDoctor && selectedPatient && (
          <div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
              <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                className="mt-8 w-full max-w-md bg-white rounded-lg p-10"
              >
                <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">
                  Consultation Type
                </h2>
                <div className="flex justify-center mb-4 space-x-4">
                  <button
                    onClick={() => handleConsultationChange("inperson")}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                      consultationType === "inperson"
                        ? "bg-[#00A182] text-white border-[#00A182]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    In-person
                  </button>
                  <button
                    onClick={() => handleConsultationChange("online")}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                      consultationType === "online"
                        ? "bg-[#00A182] text-white border-[#00A182]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Online
                  </button>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg shadow-inner">
                  <p className="text-gray-600 text-base font-medium">
                    Price: ₹{price}
                  </p>
                </div>
              </div>
              <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                className="mt-8 w-full max-w-lg bg-white rounded-lg p-6"
              >
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
                    {schedule
                      .slice(currentIndex, currentIndex + 5)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`rounded-md px-4 py-2 mb-2 ml-4 cursor-pointer transition-colors duration-200 ${
                            selectedDate === item
                              ? "bg-[#00A182] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => handleDateSelect(item)}
                          style={{
                            boxShadow:
                              "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                          }}
                        >
                          <p className="text-center">{item.day}</p>
                          <p className="text-center">{item.date}</p>
                        </div>
                      ))}
                  </div>
                  <FaAngleRight
                    size={24}
                    color="gray"
                    className={`cursor-pointer transition-opacity duration-300 ${
                      currentIndex === schedule.length - 5
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-75"
                    }`}
                    onClick={() => handleArrowClick("right")}
                  />
                </div>
                {selectedDate && (
                  <h2 className="text-lg font-semibold text-gray-500 mt-6 text-center">
                    Selected Date: {selectedDate.day}, {selectedDate.date}
                  </h2>
                )}
              </div>
            </div>
            <div className="pl-3">
              <h2 className="text-lg font-semibold text-gray-500 mt-6">
                Available Slot
              </h2>
              <div className="flex gap-2 mt-4">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className={`rounded-md px-4 py-2 mb-2 cursor-pointer transition-colors duration-200 ${
                      selectedTimeSlot === time
                        ? "bg-[#00A182] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleTimeSlotSelect(time)}
                  >
                    <p className="text-center">{time}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-3">
              <button className="border border-slate-300 py-2 px-6 rounded-md transition transform hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008a6c]">
                Cancel
              </button>
              <Link to={"/payment"}>
                <button className="bg-[#00A182] text-white py-2 px-6 rounded-md transition transform hover:scale-110 hover:bg-[#008a6c] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A182]">
                  Book Appointment
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
