import React, { useState, useEffect } from "react";
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
import { createBilling, getBillingById, updateBilling } from "../../Store/billingSlice";
import { updateMedicine, getAllMedicines } from "../../Store/MedicinesSlice";
import { fetchPatients } from "../../Store/patientSlice";
import { fetchLocations } from "../../Store/locationSlice";
import { fetchLocationProfiles } from "../../Store/profileSlice";

const AddBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billIdFromUrl = searchParams.get("id");
  const { patients } = useSelector((state) => state.patient);
  const { profileData } = useSelector((state) => state.profile);
  const { locations } = useSelector((state) => state.locations);
  const { medicines } = useSelector((state) => state.Medicines);
  const { billing } = useSelector((state) => state.billing);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bills, setBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [doctorFees, setDoctorFees] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [billId, setBillId] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");

  const GST_RATE = 0.18;

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 10 }));
    dispatch(fetchLocations({
      currentPage: null,
      itemsPerPage: null,
      sortBy: null,
      order: null,
    }));
    dispatch(getAllMedicines({
      currentPage: null,
      itemsPerPage: null,
      sortBy: null,
      order: null,
      doctorId:profileData._id
    }));

    const tenantId = Cookies.get("TenantId");
    const locationId = profileData?.locations?.[0];
    const userType = profileData?.tenants?.[0]?.userType;
    const accessToken = Cookies.get("Token");

    if (tenantId && locationId && userType && accessToken) {
      dispatch(fetchLocationProfiles({ tenantId, locationId, userType, accessToken }));
    }
  }, [dispatch, profileData]);

  useEffect(() => {
    if (!billIdFromUrl) {
      setBillId(`${Math.random().toString(36).substring(2, 6).toUpperCase()}${Date.now()}`);
    }
  }, [billIdFromUrl]);

  useEffect(() => {
    if (billIdFromUrl) {
      dispatch(getBillingById(billIdFromUrl))
        .then(({ payload }) => {
          const { patientName, doctorName, phoneNumber, services, doctorFees, dueAmount, billId, patientId, doctorId, locationId } = payload;
          
          setSelectedPatient({
            _id: patientId,
            firstName: patientName.split(" ")[0],
            lastName: patientName.split(" ")[1],
            phoneNumber
          });
          
          setSelectedDoctor({
            _id: doctorId,
            firstName: doctorName.split(" ")[0],
            lastName: doctorName.split(" ")[1],
          });
          
          const locationData = locations.find(loc => loc._id === locationId);
          if (locationData) setSelectedLocation(locationData);
          
          setBills(services);
          setTotalAmount(dueAmount);
          setDueAmount(dueAmount);
          setDoctorFees(doctorFees);
          setBillId(billId);
        })
        .catch((error) => toast.error(`Error fetching billing: ${error.message}`));
    }
  }, [billIdFromUrl, dispatch, locations]);

  const handleAddService = (newService) => {
    setBills(prev => [...prev, newService]);
    setTotalAmount(prev => prev + (newService.price * newService.quantity));
  };

  const handleDeleteService = (index) => {
    const removedAmount = bills[index].price * bills[index].quantity;
    setBills(prev => prev.filter((_, i) => i !== index));
    setTotalAmount(prev => prev - removedAmount);
  };

  const handlePaymentChange = (e) => {
    const paid = parseFloat(e.target.value) || 0;
    setPaidAmount(paid);
    const total = totalAmount + (totalAmount * GST_RATE) + doctorFees;
    setDueAmount(total - paid);
  };

  const handleCreateBilling = () => {
    if (!selectedPatient || !selectedDoctor || !selectedLocation) {
      toast.error("Please select patient, doctor, and location!");
      return;
    }
    const tenantId = Cookies.get("TenantId");
    const status = dueAmount === 0;
    const medicineUpdates = bills
      .filter(bill => bill.category === "Medicine" && bill.medicineId)
      .map(bill => {
        if (!bill.medicineId || !bill.quantity || !bill.currentStock) {
          console.error("Invalid medicine data:", bill);
          return null;
        }
        const purchaseQuantity = parseInt(bill.quantity);
        const currentStock = parseInt(bill.currentStock);
        const maxQuantity = parseInt(bill.maxQuantity || 0);
        if (isNaN(purchaseQuantity) || isNaN(currentStock)) {
          console.error("Invalid quantity values:", {
            purchaseQuantity,
            currentStock,
            maxQuantity
          });
          return null;
        }
        const remainingStock = currentStock - purchaseQuantity;
        if (remainingStock < 0) {
          toast.error(`Insufficient stock for medicine: ${bill.name}`);
          return null;
        }
        const isOutOfStock = remainingStock <= 0;
        return {
          medId: bill.medicineId,
          body: {
            unit: remainingStock.toString(),
            maxQuantity: maxQuantity.toString(),
            sale: isOutOfStock ? "yes" : "no"
          }
        };
      })
      .filter(update => update !== null);
    Promise.all(
      medicineUpdates.map(update => dispatch(updateMedicine(update)))
    )
      .then(() => {
        const commonData = {
          patientId: selectedPatient._id,
          patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
          doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
          doctorId: selectedDoctor._id,
          locationName: selectedLocation.name,
          locationId: selectedLocation._id,
          uhid: selectedPatient.uhid, 
          billId,
          phoneNumber: selectedPatient.phoneNumber,
          tenantId
        };
        const billingData = {
          services: bills.map(bill => ({
            ...bill,
            ...(bill.category === "Medicine" && {
              medicineId: bill.medicineId,
              maxQuantity: bill.maxQuantity
            })
          })),
          dueAmount,
          gst: gstAmount,
          doctorFees,
          totalAmount,
          createdBy: Cookies.get("UserId"),
          updatedBy: Cookies.get("UserId"),
          status,
          tenantId,
          paidAmount
        };

        const dispatchPromise = billIdFromUrl
          ? dispatch(updateBilling({
              billId: billIdFromUrl,
              body: { ...billingData, phoneNumber: billing.phoneNumber }
            }))
          : dispatch(createBilling({ ...billingData, ...commonData }));

        return dispatchPromise;
      })
      .then((response) => {
        toast.success(`Billing record ${billIdFromUrl ? 'updated' : 'created'} successfully!`);
        navigate('/paymentconfirmation', {
          state: {
            billing: {
              ...response.payload,
              gst: gstAmount,
              totalAmount,
              doctorFees,
              dueAmount,
              status
            }
          }
        });
      })
      .catch((error) => {
        toast.error(`Error ${billIdFromUrl ? 'updating' : 'creating'} billing: ${error.message}`);
        console.error("Detailed error:", error);
      });
  };


  const gstAmount = totalAmount * GST_RATE;
  const totalWithGST = totalAmount + gstAmount + doctorFees;

  return (
    <div className="p-1 bg-gray-100 flex flex-col customScrollbar max-h-full">
      <div className="flex justify-between items-center w-max gap-5">
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
      {selectedLocation && selectedPatient && selectedDoctor && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-md">
          {/* <div className="flex items-center justify-between space-x-10">
          <ServiceDropdown 
            onAddService={handleAddService} 
            billId={billId} 
            billIdFromUrl={billIdFromUrl}
            selectedLocation={selectedLocation} 
            medicines={medicines}
          />
          <div className="border-b border-gray-100 mt-5">
            <div className="flex items-center space-x-2 ">
              <IndianRupee className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Added Services</h2>
            </div>
            <BillTable 
              bills={bills} 
              onDelete={handleDeleteService} 
              totalAmount={totalAmount} 
            />
          </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
  <ServiceDropdown 
    onAddService={handleAddService} 
    billId={billId} 
    billIdFromUrl={billIdFromUrl}
    selectedLocation={selectedLocation} 
    medicines={medicines}
  />
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <IndianRupee className="w-5 h-5 text-gray-600" />
      <h2 className="text-xl font-semibold text-gray-900">Added Services</h2>
    </div>
    <BillTable 
      bills={bills} 
      onDelete={handleDeleteService} 
      totalAmount={totalAmount}
      billIdFromUrl={billIdFromUrl}
    />
  </div>
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>GST (18%)</span>
                <span>₹{gstAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Doctor Fees</span>
                <span>₹{doctorFees?.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹{totalWithGST?.toFixed(2)}</span>
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between items-center text-red-500 font-semibold">
                  <span>Due Amount</span>
                  <span>₹{dueAmount?.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={handlePaymentChange}
                    max={totalWithGST}
                    className="pl-10 w-full h-12 bg-white border-2 border-gray-200 rounded-xl
                      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                      transition-all duration-200"
                  />
                </div>
                {paidAmount < totalWithGST && (
                  <p className="mt-2 text-sm text-red-500">
                    Remaining: ₹{dueAmount.toFixed(2)}
                  </p>
                )}
              </div>
              <CustomButton
                text={billIdFromUrl ? "Update Bill" : "Create Bill"}
                onclick={handleCreateBilling}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBill;