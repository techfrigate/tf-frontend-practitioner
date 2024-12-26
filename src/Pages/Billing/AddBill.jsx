import React, { useState, useEffect } from "react";
import ServiceDropdown from "./ServiceDropdown";
import BillTable from "./BillTable";
import { Receipt, CreditCard } from "lucide-react";
import BillPDF from "./BillPDF";
import CustomButton from "../../Components/Common/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatients } from "../../Store/patientSlice";
import { fetchLocationProfiles } from "../../Store/profileSlice";
import toast from "react-hot-toast";
import { useNavigate,useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { fetchLocations } from "../../Store/locationSlice";
import DoctorSearch from "./DoctorSearch";
import PatientSearch from "./PatientSearch";
import LocationSearch from "./LocationSearch";
import { createBilling,getBillingById ,updateBilling} from "../../Store/billingSlice"; 

const AddBill = () => {
  const { patients } = useSelector((state) => state.patient);
  const { profileData, locationProfiles } = useSelector(
    (state) => state.profile
  );
  const {billing} = useSelector((state)=>state.billing)
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch();
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bills, setBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [doctorFees, setDoctorFees] = useState(500);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const gstRate = 0.18;
  const [dueRecords, setDueRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [billId, setBillId] = useState("");
  const { locations } = useSelector((state) => state.locations);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 10 }));
  }, []);

  
  const billIdFromUrl = searchParams.get("id");
  useEffect(() => {
    if (billIdFromUrl) {
      dispatch(getBillingById(billIdFromUrl))
        .then((billingData) => {
          const { patientName, doctorName,phoneNumber, locationName, services, gst, doctorFees, dueAmount, billId, patientId, doctorId, locationId } = billingData.payload;
          setSelectedPatient({
            _id: patientId,
            firstName: patientName.split(" ")[0],
            lastName: patientName.split(" ")[1],
            phoneNumber:{
              dialCode:phoneNumber.dialCode,
              value:phoneNumber.value
            }
          });
          setSelectedDoctor({
            _id: doctorId,
            firstName: doctorName.split(" ")[0],
            lastName: doctorName.split(" ")[1],
          });
          setSelectedLocation({
            _id: locationId,
            name: locationName,
          });
          setBills(services);
          setTotalAmount(dueAmount);
          setDueAmount(dueAmount);
          setDoctorFees(doctorFees);
          setBillId(billId);

          const savedRecords = JSON.parse(localStorage.getItem("dueRecords")) || [];
          setDueRecords(savedRecords);
        })
        .catch((error) => {
          toast.error(`Error fetching billing data: ${error.message}`);
        });
    }
  }, []);

  useEffect(() => {
    const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedBillId = `${randomLetters}${Date.now()}`;
    setBillId(generatedBillId); 
  }, []);

  useEffect(() => {
    dispatch(
      fetchLocations({
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: null,
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
    setTotalAmount((prev) => prev + (newService.price*newService.quantity));
  };

  const handleDeleteService = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    console.log(updatedBills,bills)
    const removedAmount = bills[index].price*bills[index].quantity;
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


  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem("dueRecords")) || [];
    setDueRecords(savedRecords);
  }, []);

  function generateUHID() {
    const randomNumber = Math.floor(Math.random() * 1000000); 
    return `UH${randomNumber.toString().padStart(6, '0')}`; 
  }


  const handleCreateBilling = () => {
    if (!selectedPatient || !selectedDoctor || !selectedLocation) {
      toast.error("Please select patient, doctor, and location!");
      return;
    }
  
    const uhid = generateUHID();
  
    const status = dueAmount === 0;

    const commonData= {
      patientId: selectedPatient._id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
      doctorId: selectedDoctor._id,
      locationName: selectedLocation.name,
      locationId: selectedLocation._id,
      uhid: uhid,
      billId: billId, 
      phoneNumber: {
        dialCode: selectedPatient.phoneNumber.dialCode,
        value: selectedPatient.phoneNumber.value,
      },
    }
  
    const billingData = {
      services:bills,
      dueAmount: dueAmount,
      gst: gstAmount,
      doctorFees: doctorFees,
      totalAmount,
      createdBy: Cookies.get("UserId"),
      updatedBy: Cookies.get("UserId"), 
      status: status, 
     
    };
  const{phoneNumber} = billing
    if(billIdFromUrl){
     
      dispatch(updateBilling({billId:billIdFromUrl, body:{...billingData,phoneNumber}}))
      .then(() => {
        toast.success("Billing record created successfully!");
        navigate(`/billing`);
      })
      .catch((error) => {
        toast.error(`Error creating billing: ${error.message}`);
      });
    }
    else{dispatch(createBilling({...billingData,...commonData}))
      .then(() => {
        toast.success("Billing record created successfully!");
        navigate(`/billing`);
      })
      .catch((error) => {
        toast.error(`Error creating billing: ${error.message}`);
      });}
    
  };

  return (
    <div className="p-2 min-h-screen bg-gray-100 flex flex-col h-full customScrollbar">
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
      {selectedLocation && selectedPatient && selectedDoctor && (
        <div className="mt-4 h-max">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="space-y-6">
              <ServiceDropdown onAddService={handleAddService}  billId={billId}/>
             <div className="border-b border-gray-100">
               <div className="flex items-center space-x-2 ">
                 <Receipt className="w-5 h-5 text-gray-600" />
                 <h2 className="text-xl font-semibold text-gray-900">Added Services</h2>
               </div>
               <BillTable bills={bills} onDelete={handleDeleteService} totalAmount={totalAmount} />
             </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex items-center space-x-4">
                  <CustomButton
              text={billIdFromUrl?"Update Bill" :"Create Bill"}
              onclick={handleCreateBilling}
            />
                    <BillPDF
                      hospitalLogo="https://thumbs.dreamstime.com/b/hospital-logo-icon-hospital-logo-icon-135146804.jpg"
                      bills={bills}
                      totalAmount={totalAmount}
                      gst={gstAmount}
                      doctorFees={doctorFees}
                      finalAmount={totalWithGST}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBill;
