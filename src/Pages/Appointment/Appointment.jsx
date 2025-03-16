import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSlots } from "../../Store/slotsSlice";
import { clearError, fetchPatients } from "../../Store/patientSlice";
import { clearAppointmentError, createAppointment } from "../../Store/appointmentSlice";
import { isAfter, isToday, parseISO } from "date-fns";
import DoctorSearch from "../../Components/appointment/DoctorSearch";
import PatientSearch from "../../Components/appointment/PatientSearch";
import ConsultationType from "../../Components/appointment/ConsultationType";
import ScheduleSelector from "../../Components/appointment/ScheduleSelector";
import AvailableSlots from "../../Components/appointment/AvailableSlots";
import Payment from "../../Components/Payment/Payment";
import Loader from "../../Components/Common/Loader";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import CustomButton from "../../Components/Common/CustomButton";

const Appointment = () => {
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationType, setConsultationType] = useState("Offline");
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [consultationDateshow, setConsultationDateshow] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [noSlotsAvailable, setNoSlotsAvailable] = useState(false);  

  
  const { isLoading, error } = useSelector((state) => state.appointment);
 
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getSlots());
    dispatch(fetchPatients({ page: null, limit: null,sortBy:null,order:null }));
  }, [dispatch]);


  const filteredSlots = useMemo(() => {
    if (!selectedDoctor?.slots?.length) return [];
    return selectedDoctor.slots.filter(
      (slot) =>
        (isAfter(parseISO(slot.startDate), new Date()) ||
        isToday(parseISO(slot.startDate))) && 
        (slot.visitType === consultationType || slot.visitType === "Both")
    );
  }, [selectedDoctor, consultationType]);


  useEffect(() => {
    if (consultationDateshow && filteredSlots.length) {
      setSelectedDate({
        startDate: filteredSlots[0].startDate,
        slotId: filteredSlots[0]._id,
      });
    } else {
      setSelectedDate({});
    }
  }, [consultationDateshow, filteredSlots]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate.slotId) return;
    
    const selectedSlot = selectedDoctor.slots.find(
      (slot) => slot._id === selectedDate.slotId
    );
    
    if (!selectedSlot?.slotsDetail?.length) return;

    const categorizedSlots = categorizeSlots(selectedSlot.slotsDetail);
    
   const findSlot =  categorizedSlots.morningSlots.find(
      (slot) => slot.status ==="available"
   ) || categorizedSlots.afternoonSlots.find(
      (slot) => slot.status ==="available"
   ) || categorizedSlots.eveningSlots.find(
      (slot) => slot.status ==="available"
   ) 

   
    setSelectedTimeSlot(findSlot);
  }, [selectedDate, selectedDoctor]);

 
  const categorizeSlots = useCallback((slotsDetail) => {
    return slotsDetail.reduce(
      (acc, slot) => {
        const hour = new Date(slot.startDateTime).getUTCHours();
        if (hour < 12) acc.morningSlots.push(slot);
        else if (hour < 18) acc.afternoonSlots.push(slot);
        else acc.eveningSlots.push(slot);
        return acc;
      },
      { morningSlots: [], afternoonSlots: [], eveningSlots: [] }
    );
  }, []);
 
  const handleDoctorSelect = useCallback((doctor) => {
    if (!doctor?.slots?.length) {
      setSelectedDoctor(null);
      setConsultationDateshow(false);
      setNoSlotsAvailable(true);
      return;
    }

    const futureSlots = doctor.slots.filter(
      (slot) =>
        isAfter(parseISO(slot.startDate), new Date())||
        isToday(parseISO(slot.startDate))
    );

    if (!futureSlots.length) {
      setSelectedDoctor(null);
      setConsultationDateshow(false);
      setNoSlotsAvailable(true);
      return;
    }

    setSelectedDoctor({ ...doctor, slots: futureSlots });
    setConsultationType(
      futureSlots[0].visitType === "Both" ? "Online" : futureSlots[0].visitType
    );
    setSearchDoctor(
      `${doctor.practitionerData.firstName} ${doctor.practitionerData.lastName} - ${doctor.practitionerData.speciality}`
    );
    setSelectedDate({
      startDate: futureSlots[0].startDate,
      slotId: futureSlots[0]._id,
    });
    setConsultationDateshow(true);
    setNoSlotsAvailable(false);  
  }, []);

  const handlePatientSelect = useCallback((patient) => {
    if (!patient) {
      setSearchPatient("");
      setSelectedPatient(null);
      return;
    }
    setSelectedPatient(patient);
    setSearchPatient(`${patient.firstName} ${patient.lastName}`);
  }, []);

 
  const handleConsultationChange = useCallback((type) => {
    setConsultationType(type);

    if (!selectedDoctor?.slots?.length) return;

    const filteredSlots = selectedDoctor.slots.filter(
      (slot) => slot.visitType === type || slot.visitType === "Both"
    );

    if (filteredSlots.length) {
      setSelectedDate({ 
        startDate: filteredSlots[0].startDate, 
        slotId: filteredSlots[0]._id 
      });
      setNoSlotsAvailable(false);
    } else {
      setSelectedDate({});
      setNoSlotsAvailable(true);
    }
  }, [selectedDoctor]);

  const handleBookAppointment =  () => {
    if (!selectedDoctor || !selectedPatient || !selectedTimeSlot || !selectedDate.slotId) return;
    
    const slotSelected = selectedDoctor.slots.find(
      (elm) => elm._id === selectedDate.slotId
    );
    
    if (!slotSelected) return;
    
    const patientId = selectedPatient._id;
    const amount =
      consultationType === "Online"
        ? selectedDoctor.practitionerData?.work.online
        : selectedDoctor.practitionerData?.work.inPerson;
    
    if (!amount) return;

    const body = {
      slotId: selectedDate.slotId,
      patientId,
      locationId: selectedDoctor.locationData._id,
      practitionerId: selectedDoctor.practitionerData._id,
      channelName:
        patientId + selectedDoctor.practitionerData._id + selectedDate.slotId,
      amountDetails: {
        amount,
        gst: 18,
        discount: 0,
        netAmount: (amount * 118) / 100,
      },
      paymentMethod: "online",
      paymentStatus: "pending",
      bookingStatus: { pending: new Date() },
      startDateTime: selectedTimeSlot.startDateTime,
      endDateTime: selectedTimeSlot.endDateTime,
      visitType: consultationType,
      duration: slotSelected.duration,
    };
 
    dispatch(
    createAppointment({
      body,
      slotDetailSlotId: selectedTimeSlot._id,
      slotId: selectedDate.slotId,
      setShowPayment,
    })
  );
 
  };

 
 const currentSelectedSlot = useMemo(() => {
  if (!selectedDoctor?.slots || !selectedDate.slotId) return null;
  return selectedDoctor.slots.find(slot => slot._id === selectedDate.slotId);
}, [selectedDoctor, selectedDate.slotId]);

// Memoize categorized slots for the selected date
const categorizedSlotsForDate = useMemo(() => {
  if (!currentSelectedSlot?.slotsDetail) return { 
    morningSlots: [], 
    afternoonSlots: [], 
    eveningSlots: [] 
  };
  return categorizeSlots(currentSelectedSlot.slotsDetail);
}, [currentSelectedSlot, categorizeSlots]);

useEffect(()=>{
if(error){
  toast.error(error);
  setTimeout(() => {
    dispatch(clearAppointmentError())
  },2000)
}
},error)

  if (isLoading) return <Loader />;
 
  return (
    <div className="px-3 py-3 h-[100%] customScrollbar">
      {showPayment ? (
        <Payment setShowPayment={setShowPayment}/>
      ) : (
        <div className="pb-4 p-4 h-[100%]">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <DoctorSearch
              searchDoctor={searchDoctor}
              handleDoctorSelect={handleDoctorSelect}
            />
            <PatientSearch
              searchPatient={searchPatient}
              handlePatientSelect={handlePatientSelect}
            />
          </div>

          {noSlotsAvailable && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="mt-6 flex flex-col  items-center justify-center bg-red-100 text-red-700 border border-red-300 rounded-lg p-4 shadow-md max-w-md mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                <h3 className="text-lg font-semibold">No Available Slots</h3>
                <p className="text-sm text-red-600 text-center">
                  This doctor currently has no available slots. Please select
                  another doctor.
                </p>
              </div>
            </div>
          )}

          {selectedDoctor && selectedPatient && !noSlotsAvailable && (
            <div>
              <ConsultationType
                consultationType={consultationType}
                 handleConsultationChange={handleConsultationChange}
                selectedDoctor={selectedDoctor}
              />
              {consultationDateshow && (
                <ScheduleSelector
                  selectedDoctor={selectedDoctor}
                  consultationType={consultationType}
                  handleDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
              )}
              {consultationDateshow && (
                <AvailableSlots
                   {...categorizedSlotsForDate}
                  selectedTimeSlot={selectedTimeSlot}
                  handleTimeSlotSelect={setSelectedTimeSlot}
                />
              )}
              <div className="flex gap-4 justify-end pb-5">
            <button className="border border-slate-300 py-2 px-6 rounded-md hover:scale-110 shadow-md">
              Cancel
            </button>
            <CustomButton text={"Book Appointment"} onclick={handleBookAppointment} loading={isLoading}/>
           
          </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default memo(Appointment);
