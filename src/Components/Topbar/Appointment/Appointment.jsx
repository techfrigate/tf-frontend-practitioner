import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { editSlotStatus, getSlots } from "../../../Store/slotsSlice";
import { fetchPatients } from "../../../Store/patientSlice";
import DoctorSearch from "../../appointment/DoctorSearch";
import PatientSearch from "../../appointment/PatientSearch";
import ConsultationType from "../../appointment/ConsultationType";
import ScheduleSelector from "../../appointment/ScheduleSelector";
import AvailableSlots from "../../appointment/AvailableSlots";
import Payment from "../../Payment/Payment";
import { createAppointment } from "../../../Store/appointmentSlice";

const Appointment = () => {
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationType, setConsultationType] = useState("Offline");
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [consultationDateshow, setConsultationDateshow] = useState(false);
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPayment,setShowPayment] =  useState(false);
  const { slots: { slotsData },patient: { patients }} = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSlots());
    dispatch(fetchPatients({ page: null, limit: null }));
  }, [dispatch]);

  useEffect(() => {
    if (consultationDateshow) {
      setSelectedDate({
        startDate: selectedDoctor?.slots[0]?.startDate,
        slotId: selectedDoctor?.slots[0]?._id,
      });
    } else {
      setSelectedDate({});
    }
  }, [consultationDateshow, selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor && selectedDoctor.slots) {
      const selectedSlot = selectedDoctor.slots.find(
        (slot) => slot._id === selectedDate.slotId
      );

      if (selectedSlot) {
        const { morningSlots, afternoonSlots, eveningSlots } = categorizeSlots(
          selectedSlot.slotsDetail
        );

        if (eveningSlots.length > 0) {
          setEveningSlots(eveningSlots);
          setSelectedTimeSlot(eveningSlots[0]);
        }
        if (afternoonSlots.length > 0) {
          setAfternoonSlots(afternoonSlots);
          setSelectedTimeSlot(afternoonSlots[0]);
        }
        if (morningSlots.length > 0) {
          setMorningSlots(morningSlots);
          setSelectedTimeSlot(morningSlots[0]);
        }
      }
    }
  }, [selectedDate, selectedDoctor]);

  const handleDoctorSearch = (e) => {
    setSearchDoctor(e.target.value);
    const results = slotsData.filter((doc) => {
      const name = `${doc.slots[0].practitionerData.firstName.toLowerCase()} ${doc.slots[0].practitionerData.lastName.toLowerCase()}`;
      return name.includes(e.target.value.toLowerCase());
    });
    setFilteredDoctors(results);
  };

  const handlePatientSearch = (e) => {
    setSearchPatient(e.target.value);
    const results = patients.filter((pat) => {
      const name = `${pat.firstName.toLowerCase()} ${pat.lastName.toLowerCase()}`;
      return (
        name.includes(e.target.value.toLowerCase()) ||
        pat.email.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFilteredPatients(results);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFilteredDoctors([]);
    setSearchDoctor(
      `${doctor.slots[0].practitionerData.firstName} ${doctor.slots[0].practitionerData.lastName} - ${doctor.slots[0].practitionerData.speciality}`
    );
    setConsultationType(doctor.slots[0].visitType);
    setSelectedDate({ startDate: doctor.slots[0].startDate, slotId: doctor.slots[0]._id });
    setConsultationDateshow(true);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFilteredPatients([]);
    setSearchPatient(`${patient.firstName} ${patient.lastName}`);
  };
console.log(selectedDoctor);
  const categorizeSlots = (slotsDetail) => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];

    slotsDetail.forEach((slot) => {
      const hour = new Date(slot.startDateTime).getUTCHours();
      if (hour < 12) {
        morningSlots.push(slot);
      } else if (hour < 18) {
        afternoonSlots.push(slot);
      } else {
        eveningSlots.push(slot);
      }
    });

    return { morningSlots, afternoonSlots, eveningSlots };
  };

  const handleConsultationChange = (type) => {
    setConsultationType(type);
    const findslot = selectedDoctor.slots.find(
      (elm) => elm.visitType === "both" || elm.visitType === type
    );
    setConsultationDateshow(!!findslot);
  };

  const handleArrowClick = (direction) => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < selectedDoctor.slots.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDateSelect = (slotData) => {
    setSelectedDate(slotData);
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

 

const handleBookAppointment =()=>{
 const slotSelctedDoctor =  selectedDoctor.slots.find((elm)=>elm._id === selectedDate.slotId)
const patientId =  selectedPatient._id
const amount =  consultationType==='Online'?selectedDoctor.slots[0].practitionerData.onlineFees:selectedDoctor.slots[0].practitionerData.inPersonFees
const amountDetails = {
  amount,
  gst:18,
  discount:0,
  netAmount:amount*82/100
}

const{_id:slotDetailSlotId,endDateTime,startDateTime}=selectedTimeSlot
const{locationId,practitionerId,practitionerData:{_id:precMoongid, ...resPractitionerData},locationData:{_id,...resLocationData},visitType,duration} = slotSelctedDoctor

const{phoneNumber:{dialCode,value}, ...resPracData} =  resPractitionerData
const{address:{_id:locationAddressid,  ...resLocationAddress}, ...resLocaData} = resLocationData
const body = {
  slotId: selectedDate.slotId,
  patientId,
  locationId,
  practitionerId,
  amountDetails,
  paymentMethod: "online",
  paymentStatus: "pending",
  bookingStatus: {
    pending: new Date(),
  },
  startDateTime,
  endDateTime,
  visitType,
  duration,
  practitionerData:{
    ...resPracData,
    phoneNumber:{
      dialCode,value
    }
  },
  locationData:{
    ...resLocaData,
    address:{
      ...resLocationAddress
    }

  }
}

dispatch(createAppointment({body,slotDetailSlotId,slotId:selectedDate.slotId,setShowPayment}))
}

 
  return (
    <div className="px-3 py-3 h-[100%] customScrollbar">
    {
      showPayment?<Payment/>:
      <div className="border-2 border-[#ecf7f4] shadow-lg   rounded-lg pb-4 p-4 bg-gray-50 h-[100%]  ">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto">
          <DoctorSearch
            searchDoctor={searchDoctor}
            handleDoctorSearch={handleDoctorSearch}
            filteredDoctors={filteredDoctors}
            handleDoctorSelect={handleDoctorSelect}
          />
          <PatientSearch
            searchPatient={searchPatient}
            handlePatientSearch={handlePatientSearch}
            filteredPatients={filteredPatients}
            handlePatientSelect={handlePatientSelect}
          />
        </div>
        {selectedDoctor && selectedPatient && (
          <div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
              <ConsultationType
                consultationType={consultationType}
                handleConsultationChange={handleConsultationChange}
                selectedDoctor={selectedDoctor}
              />
              {consultationDateshow && (
                <ScheduleSelector
                  selectedDoctor={selectedDoctor}
                  consultationType={consultationType}
                  handleDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  currentIndex={currentIndex}
                  handleArrowClick={handleArrowClick}
                />
              )}
            </div>
            {consultationDateshow && (
              <AvailableSlots
                morningSlots={morningSlots}  
                afternoonSlots={afternoonSlots}
                eveningSlots={eveningSlots}
                selectedTimeSlot={selectedTimeSlot}
                handleTimeSlotSelect={handleTimeSlotSelect}
              />
            )}
            <div className="flex gap-4 justify-end mt-3">
              <button className="border border-slate-300 py-2 px-6 rounded-md transition transform hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008a6c]">
                Cancel
              </button>
              
                <button className="bg-[#00A182] text-white py-2 px-6 rounded-md transition transform hover:scale-110 hover:bg-[#008a6c] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A182]" onClick={handleBookAppointment}>
                  Book Appointment
                </button>
          
            </div>
          </div>
        )}
      </div>
      
          }
     
    </div>
  );
};

export default Appointment;
