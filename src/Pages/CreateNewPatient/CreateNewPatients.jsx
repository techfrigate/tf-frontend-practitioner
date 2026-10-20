import React, { useCallback, useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import AddressInfo from "./AddressInfo";
import {
  personalInfoFormData,
  addressInfo as addressFormData,
} from "./NewpatientFormData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { photoError, uploadPatientPhoto } from "../../util/fileUploader";
import {
  addPatient,
  fetchPatientById,
  patchPatientById,
} from "../../Store/patientSlice";
import CustomImageInput from "../../Components/Common/CustomImageInput";
import toast from "react-hot-toast";
import CustomButton from "../../Components/Common/CustomButton";

const CreateNewPatients = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    gender: "",
    uhid: "",
    dialCode: "+91",
    phoneNumber: "",
  });

  const [addressInfo, setAddressInfo] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  // New photo chosen in the form; uploaded after the patient is saved (new patients get their id then).
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [inValidObject, setInvalidObject] = useState({});
  const { profileData } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const { patient, saveStatus } = useSelector((state) => state.patient);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = photoError(file);
    if (problem) {
      setInvalidObject((pre) => ({ ...pre, image: problem }));
      toast.error(problem);
      return;
    }
    setPhotoFile(file);
    setImageUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setInvalidObject((pre) => ({ ...pre, image: "" }));
  }, []);

  const handlePersonalInfoChange = useCallback((e) => {
    const { id, value } = e.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    setInvalidObject((pre) => ({ ...pre, [id]: "" }));
  }, []);

  const handleChange = useCallback((name, value) => {
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setInvalidObject((pre) => ({ ...pre, [name]: "" }));
  }, []);

  const handleDialCodeChange = useCallback((code) => {
    setPersonalInfo((prevState) => ({
      ...prevState,
      dialCode: code,
    }));
  }, []);

  const generateUHID = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `UHI${randomNumber.toString().padStart(6, "0")}`;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSavePatient = useCallback(async () => {
    const validCheck = { ...personalInfo, ...addressInfo };
    const invalidObj = {};

    Object.keys(validCheck).forEach((key) => {
      if (!validCheck[key] && key !== "address2" && validCheck[key] === "") {
        invalidObj[key] = `please provide ${key}`;
      }
      return null;
    });

    if (!validatePhoneNumber(personalInfo.phoneNumber)) {
      invalidObj.phoneNumber = `Please provide a valid 10-digit phone number`;
    }

    if (!/^\d{6}$/.test(addressInfo.zipCode)) {
      invalidObj.zipCode = "Zipcode should be exactly 6 digits";
    }

    if (!photoFile && !imageUrl && !patientId) {
      invalidObj.image = "Please provide a patient photo";
    }

    if (Object.keys(invalidObj).length > 0) {
      return setInvalidObject(invalidObj);
    }

    const uhid = generateUHID();
    const tenantId = Cookies.get("TenantId");
    const tenantObj = profileData?.tenants.find(
      (elm) => elm.tenantId === tenantId
    );
    const { phoneNumber, dialCode, ...rest } = personalInfo;
    const { address1, address2, ...restAddress } = addressInfo;
    const { tenantName } = tenantObj || {};
    const tenants = [
      {
        tenantId: Cookies.get("TenantId"),
        tenantName,
        userType: "patient",
        status: true,
      },
    ];

    const body = {
      ...rest,
      phoneNumber: {
        dialCode,
        value: phoneNumber,
      },
      address: {
        addressLine1: address1,
        addressLine2: address2,
        ...restAddress,
      },
    };

    setSaving(true);
    try {
      const saved = !patientId
        ? await dispatch(addPatient({ ...body, tenants, uhid })).unwrap()
        : await dispatch(
            patchPatientById({
              id: patientId,
              userId: patient.userId,
              updates: body,
            })
          ).unwrap();
      const savedId = patientId || saved?._id || saved?.profile?._id || saved?.data?._id;
      if (photoFile && savedId) {
        try {
          await uploadPatientPhoto(savedId, photoFile);
        } catch (photoErr) {
          toast.error(`Patient saved, but the photo couldn't be uploaded: ${photoErr.message}`);
          navigate("/patients");
          return;
        }
      }
      toast.success(`Patient ${patientId ? "updated" : "added"} successfully`);
      navigate("/patients");
    } catch (error) {
      toast.error(typeof error === "string" ? error : error?.message || "Could not save the patient");
    } finally {
      setSaving(false);
    }
  }, [
    personalInfo,
    addressInfo,
    imageUrl,
    photoFile,
    patientId,
    profileData,
    patient,
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientById(patientId));
    }
  }, [patientId, dispatch]);

  useEffect(() => {
    if (patientId && patient?.address && patient) {
      const {
        address: { addressLine1, addressLine2, city, state, country, zipCode },
        imageUrl,
        phoneNumber: { dialCode, value },
        firstName,
        lastName,
        dob,
        gender,
        email,
      } = patient;

      setPersonalInfo({
        dialCode,
        phoneNumber: value,
        firstName,
        lastName,
        dob,
        gender,
        email,
      });
      setImageUrl(imageUrl);
      setAddressInfo({
        address1: addressLine1,
        address2: addressLine2,
        city,
        state,
        country,
        zipCode,
      });
    } else {
      setPersonalInfo({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        gender: "",
        dialCode: "+91",
        phoneNumber: "",
      });

      setAddressInfo({
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
    }
  }, [patientId, patient]);

  return (
    <div className="p-4 max-h-full px-3 customScrollbar">
      <div className="mb-6 max-w-xs mx-auto">
        <CustomImageInput
          id="patient-photo"
          label="Patient Photo"
          isInvalid={!!inValidObject.image}
          onchange={handleFileChange}
          imageUrl={imageUrl}
        />
      </div>
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
        setInvalidObject={setInvalidObject}
      />
      <div className="flex justify-center gap-2 mt-4">
        <button className="px-4 pb-2 pt-1.5 text-[14px] border border-brand-700 hover:bg-brand-700 hover:text-white rounded"
        onClick={() => navigate(-1)}>
          Cancel
        </button>
        <CustomButton
          type="text"
          text={patientId ? "Update" : "Create"}
          onclick={handleSavePatient}
          loading={saveStatus || saving}
        />
      </div>
    </div>
  );
};

export default CreateNewPatients;
