import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import PersonalInfo from "./PersonalInfo";
import AddressInfo from "./AddressInfo";
import { personalInfoFormData, addressInfo as addressFormData } from "./NewpatientFormData";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, fetchPatientById, patchPatientById } from "../../../Store/patientSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../Common/Loading";
import Cookies from "js-cookie";
const CreateNewPatients = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    gender: "",
    dialCode: "+91",
    phoneNumber:""
  });

  const [addressInfo, setAddressInfo] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zipCode: ""
  });
const navigate = useNavigate()
  const [inValidObject, setInvalidObject] = useState({});
  const { profileData ,status} = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id');
  
  const { patient, saveStatus } = useSelector((state) => state.patient);

  const handlePersonalInfoChange = (e) => {
    const { id, value } = e.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [id]: value
    }));

    setInvalidObject((pre)=>({...pre,[id]:""}))
  };

  const handleChange = (name, value) => {
    setPersonalInfo((prevState)=>({
      ...prevState,
      [name]: value,
    }));
    setInvalidObject((pre) => ({ ...pre, [name]: "" }));
    
  }

  const handleDialCodeChange = (code) => {
    setPersonalInfo((prevState) => ({
      ...prevState,
      dialCode: code
    }));
  };

function handleSavePatient(){
  const validCheck =    {...personalInfo,...addressInfo}  
    const invalidObj = {}
    Object.keys(validCheck).map((key)=>{
    if(!validCheck[key] && key !=="address2"){
      invalidObj[key] =  `please provied ${key}`
      }
  })

  if(!validatePhoneNumber(personalInfo.phoneNumber)) {
      invalidObj.phoneNumber = `Please provide a valid 10-digit phone number`;
    }
 if(!invalidObj){
  return setInvalidObject(invalidObj)
    }

 

  if(!patientId){
    const tenantId =  Cookies.get("TenantId");
    const tenantObj =  profileData?.tenants.find((elm)=>elm.tenantId===tenantId);
    const{tenantName} = tenantObj
    dispatch(addPatient({...personalInfo,...addressInfo,tenantName}))
  }else{
    const updates={
      ...personalInfo,...addressInfo ,tenants:patient?.tenants
    }
    dispatch(patchPatientById({id:patientId, userId:patient.userId,updates,navigate}))
  
  }
  
}

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientById(patientId));
    }
  }, [patientId, dispatch]);

useEffect(()=>{
  if(patientId&&patient?.address&&patient){
    const{address:{addressLine1,addressLine2,city,state,country,zipCode}, phoneNumber:{dialCode,value},firstName,lastName,dob,gender,email} =  patient

    setPersonalInfo(()=> ({dialCode,phoneNumber:value,firstName,lastName,dob,gender,email}))
      setAddressInfo({
        address1: addressLine1,
        address2: addressLine2,
        city,state,country,zipCode
      });
  }else{
      setPersonalInfo({
      firstName: "",lastName: "",dob: "",email: "",gender: "",dialCode: "+91",phoneNumber:""
    })

      setAddressInfo({
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
    }
  }, [patientId]);

  if (saveStatus === "loading") {
    return <Loading size="16" color="teal-500" className="h-screen" />;
  }
  if (status === "loading") {
    return <Loading size="16" color="teal-500" className="h-screen" />;
  }

  return (
    <div className="p-4 max-h-full px-3 customScrollbar">
      <FileUpload />
      <PersonalInfo
        personalInfoFormData={personalInfoFormData}
        personalInfo={personalInfo}
        handlePersonalInfoChange={handlePersonalInfoChange}
        handleDialCodeChange={handleDialCodeChange}
        inValidObject={inValidObject}
        handleChange={handleChange}
      />
      <AddressInfo
        addressFormData={addressFormData}
        addressInfo={addressInfo}
        setAddressInfo={setAddressInfo}
        inValidObject={inValidObject}

      />
      <div className="flex justify-center gap-2 mt-4">
        <button className="px-4 pb-2 pt-1.5 text-[14px] border border-[#1e817e] hover:bg-[#239591] hover:text-white rounded">
          Cancel
        </button>
        <button className="px-4 pb-2 pt-1.5 text-[14px] bg-[#1e817e] text-white hover:bg-[#166866] transition duration-300 ease-in-out rounded" onClick={handleSavePatient}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateNewPatients;
