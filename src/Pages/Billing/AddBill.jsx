import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IndianRupee, CreditCard, BedDouble, ArrowRight, Info } from "lucide-react";
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
import { ipdApi } from "../../util/ipdApi";
import { fetchLocations } from "../../Store/locationSlice";
import { fetchLocationProfiles } from "../../Store/profileSlice";

const GST_RATE = 0.18;
// Medicines and diagnostics carry their own GST %; anything without one falls back to the default rate.
const lineGst = (item) => {
  const rate = Number(item.gstPercentage);
  return item.price * item.quantity * (Number.isFinite(rate) && item.gstPercentage !== "" && item.gstPercentage != null ? rate / 100 : GST_RATE);
};

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
  // IPD bill being viewed, or an open admission of the patient picked for a new bill.
  const [ipdBill, setIpdBill] = useState(null);
  const [openAdmission, setOpenAdmission] = useState(null);
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
      await dispatch(fetchLocations({ currentPage: null, itemsPerPage: null, sortBy: null, order: null }));
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

  // A patient who is admitted should be billed on their IPD account, not with a separate counter bill.
  useEffect(() => {
    setOpenAdmission(null);
    if (billIdFromUrl || !selectedPatient?._id) return;
    ipdApi
      .list({ status: "admitted" })
      .then((rows) => setOpenAdmission(rows.find((a) => String(a.patient?._id) === String(selectedPatient._id)) || null))
      .catch(() => {});
  }, [selectedPatient, billIdFromUrl]);

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

        setIpdBill(payload.billType === "IPD" ? { admissionId: payload.admissionId, admissionNumber: payload.admissionNumber } : null);
        setBills(payload.services || []);
        setTotalAmount(payload.totalAmount || 0);
        setDoctorFees(payload.doctorFees || 0);
        // Bills saved before GST was stored: recover it from what was charged (paid + due).
        const chargedGst = (payload.paidAmount || 0) + (payload.dueAmount || 0) - (payload.totalAmount || 0) - (payload.doctorFees || 0);
        setGstAmount(payload.gst ?? (chargedGst > 0 ? chargedGst : payload.totalAmount * GST_RATE));

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
    setDueAmount(Math.max(Math.round((totalWithGST - (recievePayment + paidAmount)) * 100) / 100, 0));
  }, [totalWithGST, recievePayment, paidAmount]);

  // Services handling
  const handleAddService = useCallback((newService) => {
    const newAmount = newService.price * newService.quantity;
    setBills(prev => [...prev, newService]);
    setTotalAmount(prev => prev + newAmount);
    setGstAmount(prev => prev + lineGst(newService));
  }, []);

  const handleDeleteService = useCallback((index) => {
    setBills(prev => {
      const newBills = [...prev];
      const removedAmount = newBills[index].price * newBills[index].quantity;
      setTotalAmount(prev => prev - removedAmount);
      setGstAmount(prev => prev - lineGst(newBills[index]));
      newBills.splice(index, 1);
      return newBills;
    });
  }, []);

  // Payment input
  const handlePaymentChange = useCallback((e) => {
    // Never take more than what is still owed on the bill.
    const outstanding = Math.max(Math.round((totalWithGST - recievePayment) * 100) / 100, 0);
    const value = Math.max(parseFloat(e.target.value) || 0, 0);
    if (value > outstanding) toast.error(`Only ₹${outstanding.toFixed(2)} is outstanding on this bill.`);
    setPaidAmount(Math.min(value, outstanding));
  }, [totalWithGST, recievePayment]);

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
          billing: { ...result.payload, billId: billId || result?.billId || result?.payload?.billId || (Array.isArray(billing) ? billing[0]?.billId : billing?.billId), patientName: selectedPatient.firstName + ' ' + selectedPatient.lastName, doctorName: selectedDoctor.firstName + ' ' + selectedDoctor.lastName, services: bills, gst: gstAmount, totalAmount, doctorFees, dueAmount, status }
        }
      });
    } catch (error) {
      toast.error(`Error ${billIdFromUrl ? 'updating' : 'creating'} billing: ${error.message || 'Unknown error'}`);
      console.error("Detailed error:", error);
    }
  }, [selectedPatient, selectedDoctor, selectedLocation, bills, dueAmount, cookieValues, gstAmount, doctorFees, totalAmount, paidAmount, billId, billIdFromUrl, validateMedicineUpdates, recievePayment, billing, dispatch, navigate]);

  // UI sections (same as before)
  const searchComponents = useMemo(() => (
    <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 [&>*]:min-w-0">
      <LocationSearch searchQuery={searchQueries.location} setSearchQuery={(query) => updateSearchQuery('location', query)} locations={locations} onSelect={setSelectedLocation} selectedLocation={selectedLocation} />
      <DoctorSearch searchQuery={searchQueries.doctor} setSearchQuery={(query) => updateSearchQuery('doctor', query)} practitioners={practitioners} onSelect={setSelectedDoctor} selectedDoctor={selectedDoctor} />
      <PatientSearch searchQuery={searchQueries.patient} setSearchQuery={(query) => updateSearchQuery('patient', query)} onSelect={setSelectedPatient} selectedPatient={selectedPatient} />
    </div>
  ), [searchQueries, updateSearchQuery, locations, practitioners, selectedLocation, selectedDoctor, selectedPatient]);

  const summarySection = useMemo(() => (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-gray-600"><span>Subtotal</span><span>₹{totalAmount?.toLocaleString()}</span></div>
      <div className="flex justify-between items-center text-gray-600"><span>GST</span><span>₹{gstAmount?.toFixed(2)}</span></div>
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
          <input type="number" value={paidAmount || ""} onChange={handlePaymentChange} max={Math.max(totalWithGST - recievePayment, 0)} className="pl-10 w-full h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"/>
        </div>
        {dueAmount > 0 && <p className="mt-2 text-sm text-red-500">Remaining: ₹{dueAmount.toFixed(2)}</p>}
      </div>
      <CustomButton text={billIdFromUrl ? "Update Bill" : "Create Bill"} onclick={handleCreateBilling} loading={isLoading} />
    </div>
  ), [paidAmount, handlePaymentChange, totalWithGST, recievePayment, dueAmount, billIdFromUrl, handleCreateBilling, isLoading]);

  const missing = [!selectedLocation && "location", !selectedDoctor && "doctor", !selectedPatient && "patient"].filter(Boolean);

  return (
    <div className="p-1 bg-gray-100 flex flex-col customScrollbar max-h-full">
      {ipdBill ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <BedDouble className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Inpatient (IPD) final bill · {ipdBill.admissionNumber}</p>
              <p className="text-xs text-slate-600">Items come from the admission and can't be edited here. Use this page to collect any balance.</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate(`/ipd/admissions/${ipdBill.admissionId}`)} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
            Open admission <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        searchComponents
      )}
      {openAdmission && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <BedDouble className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-900">
              {selectedPatient.firstName} is currently admitted ({openAdmission.admissionNumber}, {openAdmission.bed?.wardName} bed {openAdmission.bed?.bedNumber}).
              Add charges to the IPD bill so they are settled at discharge.
            </p>
          </div>
          <button type="button" onClick={() => navigate(`/ipd/admissions/${openAdmission._id}`)} className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700">
            Go to IPD bill <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {!showBillingForm && !billIdFromUrl && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8">
          <Info className="mt-0.5 h-5 w-5 text-brand-500" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Start a new OPD bill</p>
            <p className="mt-1 text-sm text-slate-600">
              Choose the {missing.join(", ").replace(/, ([^,]*)$/, " and $1")} above. Then add services, diagnostics, packages or medicines and record the payment.
            </p>
            <p className="mt-2 text-xs text-slate-500">For admitted patients, charges are added on their admission and the bill is generated at discharge.</p>
          </div>
        </div>
      )}
      {showBillingForm && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-md">
          <div className={`grid w-full grid-cols-1 gap-6 [&>*]:min-w-0 ${ipdBill ? "" : "md:grid-cols-2"}`}>
            {!ipdBill && <ServiceDropdown onAddService={handleAddService} billId={billId} billIdFromUrl={billIdFromUrl} selectedLocation={selectedLocation} />}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <IndianRupee className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">{ipdBill ? "Bill items" : "Added Services"}</h2>
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
