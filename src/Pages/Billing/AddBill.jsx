import React, { useState, useEffect } from "react";
import ServiceDropdown from "./ServiceDropdown";
import BillTable from "./BillTable";
import BillPDF from "./BillPDF";
import CustomButton from "../../Components/Common/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatients } from "../../Store/patientSlice";
import { fetchLocationProfiles } from "../../Store/profileSlice";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { fetchLocations } from "../../Store/locationSlice";
import DoctorSearch from "./DoctorSearch";
import PatientSearch from "./PatientSearch";
import LocationSearch from "./LocationSearch";

const AddBill = () => {
  const { patients } = useSelector((state) => state.patient);
  const { profileData, locationProfiles } = useSelector(
    (state) => state.profile
  );
  const dispatch = useDispatch();
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bills, setBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [doctorFees, setDoctorFees] = useState(500);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [firstPayment, setFirstPayment] = useState(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const gstRate = 0.18;
  const [dueRecords, setDueRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { locations } = useSelector((state) => state.locations);

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 10 }));
  }, []);

  useEffect(() => {
    dispatch(
      fetchLocations({
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: "name",
        order: "asc",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const tenantId = Cookies.get("TenantId");
    const locationId = profileData.locations[0];
    const userType = profileData.tenants[0].userType;
    const accessToken = Cookies.get("Token");

    dispatch(
      fetchLocationProfiles({ tenantId, locationId, userType, accessToken })
    );
  }, []);

  useEffect(() => {
    dispatch(
      fetchLocations({
        currentPage: null,
        itemsPerPage: null,
        sortBy: null,
        order: null,
      })
    );
  }, []);

  const handleAddService = (newService) => {
    setBills([...bills, newService]);
    setTotalAmount((prev) => prev + newService.amount);
  };

  const handleDeleteService = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    const removedAmount = bills[index].amount;
    setBills(updatedBills);
    setTotalAmount((prev) => prev - removedAmount);
  };

  const gstAmount = totalAmount * gstRate;
  const totalWithGST = totalAmount + gstAmount + doctorFees;

  const handlePaymentChange = (e) => {
    const paidAmountInput = parseFloat(e.target.value) || "";
    setPaidAmount(paidAmountInput);
    setDueAmount(totalWithGST - paidAmountInput);
  };

  const handleSavePayment = () => {
    if (paidAmount > 0) {
      if (paidAmount <= totalWithGST) {
        if (!firstPayment) {
          setFirstPayment(paidAmount);
        }
        const remainingDue = totalWithGST - paidAmount;
        setDueAmount(remainingDue);
        setPaidAmount(0);
        const newDueRecord = {
          patientId: selectedPatient?.id,
          doctorId: selectedDoctor?.id,
          totalAmount: totalWithGST,
          paidAmount: firstPayment ? firstPayment + paidAmount : paidAmount,
          dueAmount: remainingDue,
          timestamp: new Date().toISOString(),
        };

        setDueRecords((prev) => [...prev, newDueRecord]);

        if (remainingDue === 0) {
          toast.success("Payment completed successfully!");
        } else {
          toast.success(
            `Partial payment saved! Remaining due: ₹ ${remainingDue.toFixed(2)}`
          );
        }
      } else {
        toast.error("Paid amount cannot exceed the total amount!");
      }
    } else {
      toast.error("Please enter a valid payment amount!");
    }
  };

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem("dueRecords")) || [];
    setDueRecords(savedRecords);
  }, []);

  return (
    <div className="p-2 min-h-screen bg-gray-100 flex flex-col h-full customScrollbar ">
      <div className="flex justify-between items-center gap-5">
        <LocationSearch
          searchQuery={locationSearchQuery}
          setSearchQuery={setLocationSearchQuery}
          locations={locations}
          onSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
        />
          <DoctorSearch
            searchQuery={doctorSearchQuery}
            setSearchQuery={setDoctorSearchQuery}
            doctors={locationProfiles}
            onSelect={setSelectedDoctor}
            selectedDoctor={selectedDoctor}
          />
          <PatientSearch
            searchQuery={patientSearchQuery}
            setSearchQuery={setPatientSearchQuery}
            patients={patients}
            onSelect={setSelectedPatient}
            selectedPatient={selectedPatient}
          />
        </div>
      {selectedPatient && selectedDoctor && (
        <div className="mt-8 p-6 bg-white bg-opacity-70 rounded-lg shadow-lg">
          <ServiceDropdown onAddService={handleAddService} />
          {bills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl text-[#64C6B0]font-bold mb-4">
                Added Services
              </h2>
              <BillTable bills={bills} onDelete={handleDeleteService} />
              <div className="mt-6 text-right">
                <p className="text-lg">Total Amount: ₹ {totalAmount}</p>
                <p className="text-lg">GST (18%): ₹ {gstAmount.toFixed(2)}</p>
                <p className="text-lg">Doctor Fees: ₹ {doctorFees}</p>
                <p className="text-2xl font-bold">
                  Total: ₹ {totalWithGST.toFixed(2)}
                </p>
                <p className="text-red-600 font-bold">
                  Due Amount: ₹ {dueAmount.toFixed(2)}
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-lg font-semibold mb-2">
                  Enter Payment Amount:
                </label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={handlePaymentChange}
                  className="p-3 border rounded w-full"
                  max={totalWithGST}
                />
                {paidAmount < totalWithGST && (
                  <p className="text-red-500 mt-2">
                    Remaining due amount: ₹ {dueAmount.toFixed(2)}
                  </p>
                )}
              </div>
              {dueAmount > 0 && (
                <div className="mt-4">
                  <CustomButton
                    text="Save Payment"
                    onclick={handleSavePayment}
                    className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600"
                  />
                </div>
              )}
              <div className="relative right-1">
                <BillPDF
                  hospitalLogo="https://thumbs.dreamstime.com/b/hospital-logo-icon-hospital-logo-icon-135146804.jpg"
                  bills={bills}
                  totalAmount={totalAmount}
                  gst={gstAmount}
                  doctorFees={doctorFees}
                  finalAmount={totalWithGST}
                />
              </div>
              <div className="mt-20"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddBill;
