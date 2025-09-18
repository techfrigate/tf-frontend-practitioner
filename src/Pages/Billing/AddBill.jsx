import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IndianRupee, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import ServiceDropdown from "./ServiceDropdown";
import BillTable from "./BillTable";
import CustomButton from "../../Components/Common/CustomButton";
import DoctorSearch from "./DoctorSearch";
import PatientSearch from "./PatientSearch";
import LocationSearch from "./LocationSearch";
import {
  clearBillingError,
  createBilling,
  getAllLocationPractitioners,
  getBillingById,
  updateBilling
} from "../../Store/billingSlice";
import { updateMedicine, getAllMedicines } from "../../Store/MedicinesSlice";
import { fetchPatients } from "../../Store/patientSlice";
import { fetchLocations } from "../../Store/locationSlice";
import { fetchLocationProfiles } from "../../Store/profileSlice";

const GST_RATE = 0.18;

const AddBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billIdFromUrl = searchParams.get("id");

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bills, setBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [doctorFees, setDoctorFees] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0); // new input payment
  const [recievePayment, setRecievePayment] = useState(0); // already received payment
  const [dueAmount, setDueAmount] = useState(0);
  const [billId, setBillId] = useState("");
  const [gstAmount, setGstAmount] = useState(0);

  const [searchQueries, setSearchQueries] = useState({
    location: "",
    doctor: "",
    patient: ""
  });

  const profileData = useSelector((state) => state.profile.profileData);
  const locations = useSelector((state) => state.locations.locations);
  const { billing, isLoading, error, practitioners } = useSelector((state) => state.billing);

  const totalWithGST = useMemo(() => totalAmount + gstAmount + doctorFees, 
    [totalAmount, gstAmount, doctorFees]);

  const showBillingForm = useMemo(() => 
    Boolean(selectedLocation && selectedPatient && selectedDoctor),
    [selectedLocation, selectedPatient, selectedDoctor]
  );

  const cookieValues = useMemo(() => ({
    tenantId: Cookies.get("TenantId"),
    userId: Cookies.get("UserId"),
    token: Cookies.get("Token")
  }), []);

  // Initial fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        dispatch(fetchPatients({ page: null, limit: 5 })),
        dispatch(fetchLocations({ currentPage: null, itemsPerPage: null, sortBy: null, order: null }))
      ]);
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      dispatch(getAllLocationPractitioners({ locationId: selectedLocation._id, userType: "practitioner" }));
    }
  }, [selectedLocation, dispatch]);

  useEffect(() => {
    if (!profileData?._id) return;

    dispatch(getAllMedicines({ currentPage: null, itemsPerPage: null, sortBy: null, order: null, doctorId: profileData._id }));

    const locationId = profileData?.locations?.[0];
    const userType = profileData?.tenants?.[0]?.userType;

    if (cookieValues.tenantId && locationId && userType && cookieValues.token) {
      dispatch(fetchLocationProfiles({ tenantId: cookieValues.tenantId, locationId, userType, accessToken: cookieValues.token }));
    }
  }, [dispatch, profileData, cookieValues]);

  // Generate new billId
  useEffect(() => {
    if (!billIdFromUrl) {
      setBillId(`${Math.random().toString(36).substring(2, 6).toUpperCase()}${Date.now()}`);
    }
  }, [billIdFromUrl]);

  // Fetch existing billing
  useEffect(() => {
    if (!billIdFromUrl) return;

    dispatch(getBillingById(billIdFromUrl))
      .unwrap()
      .then((response) => {
        const payload = Array.isArray(response) ? response[0] : response;
        if (!payload) return;

        setSelectedPatient({
          _id: payload.patientId,
          firstName: payload.patient?.firstName || "",
          lastName: payload.patient?.lastName || "",
          phoneNumber: payload.phoneNumber || null
        });

        setSelectedDoctor({
          _id: payload.practitionerId,
          firstName: payload.practitioner?.firstName || "",
          lastName: payload.practitioner?.lastName || "",
        });

        const locationData = locations.find(loc => loc._id === payload.locationId);
        if (locationData) setSelectedLocation(locationData);
        else setSelectedLocation({ _id: payload.locationId, name: payload.locationDisplayName || "Unknown Location" });

        setBills(payload.services || []);
        setTotalAmount(payload.totalAmount || 0);
        setDoctorFees(payload.doctorFees || 0);
        setGstAmount(payload.gst || (payload.totalAmount * GST_RATE));

        // Payment handling
        setRecievePayment(payload.paidAmount || 0); // already received
        setPaidAmount(0); // new input starts at 0
      })
      .catch((error) => {
        console.error("Full error:", error);
        toast.error(`Error fetching billing: ${error.message}`);
      });
  }, [billIdFromUrl, dispatch, locations]);

  // Recalculate due whenever totals or payments change
  useEffect(() => {
    setDueAmount(Math.max(totalWithGST - (recievePayment + paidAmount), 0));
  }, [totalWithGST, recievePayment, paidAmount]);

  // Services handling
  const handleAddService = useCallback((newService) => {
    const newAmount = newService.price * newService.quantity;
    setBills(prev => [...prev, newService]);
    setTotalAmount(prev => prev + newAmount);
    setGstAmount(prev => prev + (newAmount * GST_RATE));
  }, []);

  const handleDeleteService = useCallback((index) => {
    setBills(prev => {
      const newBills = [...prev];
      const removedAmount = newBills[index].price * newBills[index].quantity;
      setTotalAmount(prev => prev - removedAmount);
      setGstAmount(prev => prev - (removedAmount * GST_RATE));
      newBills.splice(index, 1);
      return newBills;
    });
  }, []);

  // Payment input
  const handlePaymentChange = useCallback((e) => {
    setPaidAmount(parseFloat(e.target.value) || 0);
  }, []);

  const updateSearchQuery = useCallback((field, value) => {
    setSearchQueries(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateMedicineUpdates = useCallback((bills) => {
    return bills
      .filter(bill => bill.category === "medicines" && bill.medicineId)
      .map(bill => {
        const purchaseQuantity = parseInt(bill.quantity);
        const currentStock = parseInt(bill.currentStock);
        const maxQuantity = parseInt(bill.maxQuantity || 0);
        const remainingStock = currentStock - purchaseQuantity;
        if (remainingStock < 0) {
          toast.error(`Insufficient stock for medicine: ${bill.name}`);
          return null;
        }
        return { medId: bill.medicineId, body: { unit: remainingStock.toString(), maxQuantity: maxQuantity.toString(), sale: remainingStock <= 0 ? "yes" : "no" } };
      })
      .filter(Boolean);
  }, []);

  // Billing creation/update
  const handleCreateBilling = useCallback(async () => {
    if (!selectedPatient || !selectedDoctor || !selectedLocation) {
      toast.error("Please select patient, doctor, and location!");
      return;
    }
    if (bills.length === 0) {
      toast.error("Please add at least one service or item!");
      return;
    }
    const status = dueAmount === 0;
    const medicineUpdates = validateMedicineUpdates(bills);

    try {
      await Promise.all(medicineUpdates.map(update => dispatch(updateMedicine(update)).unwrap()));

      const commonData = {
        patientId: selectedPatient._id,
        practitionerId: selectedDoctor._id,
        locationId: selectedLocation._id,
        uhid: selectedPatient.uhid,
        billId,
        phoneNumber: selectedPatient.phoneNumber,
      };

      const billingData = {
        services: bills.map(bill => ({ ...bill, ...(bill.category === "medicines" ? { medicineId: bill.medicineId, maxQuantity: bill.maxQuantity } : {}) })),
        gst: gstAmount,
        doctorFees,
        totalAmount,
        status,
        tenantId: cookieValues.tenantId,
        paidAmount: recievePayment + paidAmount,
        dueAmount,
        createdBy: cookieValues.userId,
        updatedBy: cookieValues.userId
      };

      const result = billIdFromUrl
        ? await dispatch(updateBilling({ billId: billIdFromUrl, body: { ...billingData, phoneNumber: billing?.phoneNumber || selectedPatient.phoneNumber } })).unwrap()
        : await dispatch(createBilling({ ...billingData, ...commonData })).unwrap();

      toast.success(`Billing record ${billIdFromUrl ? 'updated' : 'created'} successfully!`);
      navigate('/paymentconfirmation', {
        state: {
          billing: { ...result.payload, billId, patientName: selectedPatient.firstName + ' ' + selectedPatient.lastName, doctorName: selectedDoctor.firstName + ' ' + selectedDoctor.lastName, services: bills, gst: gstAmount, totalAmount, doctorFees, dueAmount, status }
        }
      });
    } catch (error) {
      toast.error(`Error ${billIdFromUrl ? 'updating' : 'creating'} billing: ${error.message || 'Unknown error'}`);
      console.error("Detailed error:", error);
    }
  }, [selectedPatient, selectedDoctor, selectedLocation, bills, dueAmount, cookieValues, gstAmount, doctorFees, totalAmount, paidAmount, billId, billIdFromUrl, validateMedicineUpdates, recievePayment, billing, dispatch, navigate]);

  // UI sections (same as before)
  const searchComponents = useMemo(() => (
    <div className="flex justify-between items-center w-max gap-5">
      <LocationSearch searchQuery={searchQueries.location} setSearchQuery={(query) => updateSearchQuery('location', query)} locations={locations} onSelect={setSelectedLocation} selectedLocation={selectedLocation} />
      <DoctorSearch searchQuery={searchQueries.doctor} setSearchQuery={(query) => updateSearchQuery('doctor', query)} practitioners={practitioners} onSelect={setSelectedDoctor} selectedDoctor={selectedDoctor} />
      <PatientSearch searchQuery={searchQueries.patient} setSearchQuery={(query) => updateSearchQuery('patient', query)} onSelect={setSelectedPatient} selectedPatient={selectedPatient} />
    </div>
  ), [searchQueries, updateSearchQuery, locations, practitioners, selectedLocation, selectedDoctor, selectedPatient]);

  const summarySection = useMemo(() => (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-gray-600"><span>Subtotal</span><span>₹{totalAmount?.toLocaleString()}</span></div>
      <div className="flex justify-between items-center text-gray-600"><span>GST (18%)</span><span>₹{gstAmount?.toFixed(2)}</span></div>
      <div className="flex justify-between items-center text-gray-600"><span>Doctor Fees</span><span>₹{doctorFees?.toLocaleString()}</span></div>
      <div className="h-px bg-gray-200 my-2" />
      <div className="flex justify-between items-center text-lg font-semibold"><span>Total Amount</span><span>₹{totalWithGST?.toFixed(2)}</span></div>
      {dueAmount > 0 && <div className="flex justify-between items-center text-red-500 font-semibold"><span>Due Amount</span><span>₹{dueAmount?.toFixed(2)}</span></div>}
    </div>
  ), [totalAmount, gstAmount, doctorFees, totalWithGST, dueAmount]);

  const paymentSection = useMemo(() => (
    <div className="space-y-1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCard className="h-5 w-5 text-gray-400" /></div>
          <input type="number" value={paidAmount || ""} onChange={handlePaymentChange} max={totalWithGST} className="pl-10 w-full h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"/>
        </div>
        {dueAmount > 0 && <p className="mt-2 text-sm text-red-500">Remaining: ₹{dueAmount.toFixed(2)}</p>}
      </div>
      <CustomButton text={billIdFromUrl ? "Update Bill" : "Create Bill"} onclick={handleCreateBilling} loading={isLoading} />
    </div>
  ), [paidAmount, handlePaymentChange, totalWithGST, dueAmount, billIdFromUrl, handleCreateBilling, isLoading]);

  return (
    <div className="p-1 bg-gray-100 flex flex-col customScrollbar max-h-full">
      {searchComponents}
      {showBillingForm && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <ServiceDropdown onAddService={handleAddService} billId={billId} billIdFromUrl={billIdFromUrl} selectedLocation={selectedLocation} />
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <IndianRupee className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Added Services</h2>
              </div>
              <BillTable bills={bills} onDelete={handleDeleteService} totalAmount={totalAmount} billIdFromUrl={billIdFromUrl} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            {summarySection}
            {paymentSection}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AddBill);
