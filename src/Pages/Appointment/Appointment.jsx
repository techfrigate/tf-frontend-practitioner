import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSlots } from "../../Store/slotsSlice";
import { fetchPatients } from "../../Store/patientSlice";
import { createAppointment } from "../../Store/appointmentSlice";
import { isAfter, isToday, parseISO } from "date-fns";
import DoctorSearch from "../../Components/appointment/DoctorSearch";
import PatientSearch from "../../Components/appointment/PatientSearch";
import ConsultationType from "../../Components/appointment/ConsultationType";
import ScheduleSelector from "../../Components/appointment/ScheduleSelector";
import AvailableSlots from "../../Components/appointment/AvailableSlots";
import Payment from "../../Components/Payment/Payment";
import Loader from "../../Components/Common/Loader";
import { AlertCircle } from "lucide-react";

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

  const {
    slots: { slotsData },
    patient: { patients, slotsStatus },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getSlots());
    dispatch(fetchPatients({ page: null, limit: null }));
  }, [dispatch]);

  useEffect(() => {
    if (consultationDateshow && selectedDoctor?.slots?.length) {
      const futureSlots = selectedDoctor.slots.filter(
        (slot) =>
          isAfter(parseISO(slot.startDate), new Date()) ||
          isToday(parseISO(slot.startDate)) && slot.visitType===consultationType

      );
      
      if (futureSlots.length) {
        setSelectedDate({
          startDate: futureSlots[0].startDate,
          slotId: futureSlots[0]._id,
        });
      } else {
        setSelectedDate({});
      }
    } else {
      setSelectedDate({});
    }
  }, [consultationDateshow, selectedDoctor]);
console.log(selectedPatient,"sele")
  useEffect(() => {
    if (!selectedDoctor || !selectedDoctor.slots) return;
    const selectedSlot = selectedDoctor.slots.find(
      (slot) => slot._id === selectedDate.slotId
    );
    if (!selectedSlot) return;

    const categorizedSlots = categorizeSlots(selectedSlot.slotsDetail);
    setSelectedTimeSlot(
      categorizedSlots.eveningSlots[0] ||
        categorizedSlots.afternoonSlots[0] ||
        categorizedSlots.morningSlots[0]
    );
  }, [selectedDate, selectedDoctor]);

  const handleDoctorSelect = (doctor) => {
    if (!doctor?.slots?.length) {
      setSelectedDoctor(null);
      setConsultationDateshow(false);
      setNoSlotsAvailable(true);
      return;
    }

    const futureSlots = doctor.slots.filter(
      (slot) =>
        isAfter(parseISO(slot.startDate), new Date()) ||
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
      `${futureSlots[0].practitionerData.firstName} ${futureSlots[0].practitionerData.lastName} - ${futureSlots[0].practitionerData.speciality}`
    );
    setSelectedDate({
      startDate: futureSlots[0].startDate,
      slotId: futureSlots[0]._id,
    });
    setConsultationDateshow(true);
    setNoSlotsAvailable(false);  
  };

  const handlePatientSelect = (patient) => {
    if (!patient) return setSearchPatient(""), setSelectedPatient(null);
    setSelectedPatient(patient);
    setSearchPatient(`${patient.firstName} ${patient.lastName}`);
  };

  const categorizeSlots = (slotsDetail) => {
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
  };
 
  const handleBookAppointment = () => {
    const slotSelected = selectedDoctor?.slots.find(
      (elm) => elm._id === selectedDate.slotId
    );
    const patientId = selectedPatient?._id;
    const amount =
      consultationType === "Online"
        ? selectedDoctor?.slots[0]?.practitionerData?.onlineFees
        : selectedDoctor?.slots[0]?.practitionerData?.inPersonFees;
    const{ imageUrl, firstName, lastName, email, phoneNumber:{dialCode,value}, gender, dob } = selectedPatient

    const body = {
      slotId: selectedDate.slotId,
      patientId,
      locationId: slotSelected.locationId,
      practitionerId: slotSelected.practitionerId,
      channelName:
        patientId + slotSelected.practitionerId + selectedDate.slotId,
      amountDetails: {
        amount,
        gst: 18,
        discount: 0,
        netAmount: (amount * 118) / 100,
      },
      patientData:{firstName,lastName,email,dialCode,number:value,gender,dob,imageUrl},
      paymentMethod: "online",
      paymentStatus: "pending",
      bookingStatus: { pending: new Date() },
      startDateTime: selectedTimeSlot.startDateTime,
      endDateTime: selectedTimeSlot.endDateTime,
      visitType: slotSelected.visitType,
      duration: slotSelected.duration,
      practitionerData: { ...slotSelected.practitionerData },
      locationData: { ...slotSelected.locationData },
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

  const handleConsultationChange = (type) => {
    setConsultationType(type);

    if (!selectedDoctor) return;

    const filteredSlots = selectedDoctor.slots.filter(
      (slot) => slot.visitType === type || slot.visitType === "Both"
    );

    if (filteredSlots.length) {
      setSelectedDate({ startDate: filteredSlots[0].startDate, slotId: filteredSlots[0]._id });
      setNoSlotsAvailable(false);
    } else {
      setSelectedDate({});
      setNoSlotsAvailable(true);
    }
  };


  if (slotsStatus === "loading") return <Loader />;

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
              slotsData={slotsData}
            />
            <PatientSearch
              searchPatient={searchPatient}
              patientsData={patients}
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
                  {...categorizeSlots(
                    selectedDoctor?.slots?.find(
                      (slot) => slot._id === selectedDate.slotId
                    )?.slotsDetail || []
                  )}
                  selectedTimeSlot={selectedTimeSlot}
                  handleTimeSlotSelect={setSelectedTimeSlot}
                />
              )}
              <div className="flex gap-4 justify-end pb-5">
            <button className="border border-slate-300 py-2 px-6 rounded-md hover:scale-110 shadow-md">
              Cancel
            </button>
            <button
              className="bg-[#00A182] text-white py-2 px-6 rounded-md hover:scale-110"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
          </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Appointment;
