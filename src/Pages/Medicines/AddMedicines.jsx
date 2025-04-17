import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import CustomButton from "../../Components/Common/CustomButton";
import CustomInput from "../../Components/Common/CustomInput";
import CustomSelect from "../../Components/Common/CustomSelect";
import CommonLocationSelect from "../../Components/Common/CommonLocationSelect";
import { MadicalformFields as formFields } from "../../util/data";
import { fetchLocations } from "../../Store/locationSlice";
import {
  clearMadicinesError,
  createMedicine,
  getAllPharmacies,
  getMedicineById,
  updateMedicine,
  getPharmacies
} from "../../Store/MedicinesSlice";
import Cookies from "js-cookie";
import Loader from "../../Components/Common/Loader";

const INITIAL_FORM_STATE = {
  locationName: null,
  pharmacyName: null,
  medicineName: "",
  genericName: "",
  manufacturedBy: "",
  unit: "",
  rackName: "",
  hsnCode: "",
  snowmedCtCode: "",
  gstPercentage: "",
  minQuantity: "",
  sale: "",
  mrpPerUnit: "",
  expiryDate: null,
};

const REQUIRED_FIELDS = [
  "locationName",
  "pharmacyName",
  "medicineName",
  "unit",
  "gstPercentage",
  "mrpPerUnit",
  "expiryDate",
];

const AddMedicines = () => {
  const { locations } = useSelector((state) => state.locations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [invalidFields, setInvalidFields] = useState({});
  const [availablePharmacies, setAvailablePharmacies] = useState([]);

  // eslint-disable-next-line
  const medicineId = searchParams.get("mid");

  useEffect(() => {
    if (!locations?.length) {
      dispatch(
        fetchLocations({
          currentPage: null,
          itemsPerPage: null,
          sortBy: "name",
          order: "desc",
        })
      );
    }
  }, [dispatch, locations]);

  const { profileData } = useSelector((state) => state.profile);
  const { isLoading, error } = useSelector((state) => state.medicines);

useEffect(() => {
  const fetchMedicineData = async () => {
    if (!medicineId) return;
    try {
      const medicineData = await dispatch(getMedicineById(medicineId)).unwrap();
            const locationObj = locations.find(loc => loc._id === medicineData.locationId);
      if (!locationObj) {
        toast.error("Location not found for this medicine data.");
        return;
      }      
      const pharmacyResponse = await dispatch(getPharmacies({locationId: medicineData.locationId})).unwrap();
      
      const pharmacyObj = pharmacyResponse.find(
        (p) => p._id === medicineData.pharmacyId
      );
      
      if (!pharmacyObj) {
        toast.error(`Pharmacy not found for ID: ${medicineData.pharmacyId}`);
        return;
      }
      
      const formattedData = {
        ...medicineData,
        locationName: locationObj,
        pharmacyName: pharmacyObj,
        expiryDate: medicineData?.expiryDate
        ? dayjs(medicineData.expiryDate)
        : null,
        enable: medicineData.enable || false,
        prescriptionRequired: medicineData.prescriptionRequired || false,
      };
      
      setFormData(formattedData);
      
      const allPharmacies = await dispatch(
        getAllPharmacies({
          locationId: medicineData.locationId
        })
      ).unwrap();
      
      const pharmacyOptions = allPharmacies?.map((p) => ({
        value: p._id,
        label: p.name,
        ...p,
      })) || [];
      
      setAvailablePharmacies(pharmacyOptions);
      
    } catch (error) {
      toast.error("Failed to load medicine data");
    }
  };

  if (medicineId && locations?.length) {
    fetchMedicineData();
  }
}, [medicineId, locations, dispatch, navigate]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setInvalidFields((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const handleDateChange = (name, value) => {
    if (value && dayjs(value).isValid()) {
      const formattedDate = value.toISOString();  
      setFormData((prev) => ({ ...prev, [name]: formattedDate }));  
      setInvalidFields((prev) => ({ ...prev, [name]: "" }));  
    } else {
      setFormData((prev) => ({ ...prev, [name]: null })); 
    }
  };
  

  const handleLocationSelect = async (location) => {
    handleChange("locationName", location);
    handleChange("pharmacyName", null);
    getPharmacie(location?._id)
  };

  async function getPharmacie(id){
    try {
      const response = await dispatch(
        getAllPharmacies({
          locationId: id
        })
      ).unwrap();
      const pharmacyOptions =
      response?.map((p) => ({
        value: p._id,
        label: p.name,
        ...p,
      })) || [];
      setAvailablePharmacies(pharmacyOptions);
      return response
    } catch (error) {
      console.log("Error fetching locations:", error);
    }

  }

  const handlePharmacySelect = (selectedPharmacyId) => {
    const pharmacy = availablePharmacies.find(
      (p) => p._id === selectedPharmacyId
    );
   
      const { value, label, ...pharmacyData } = pharmacy;
      handleChange("pharmacyName", pharmacyData);
    
  };

  const validateForm = () => {
    const newInvalidFields = {};

    REQUIRED_FIELDS.forEach((key) => {
      if (key === "locationName" || key === "pharmacyName") {
        if (!formData[key]?._id) {
          newInvalidFields[key] = `Please select a ${
            key === "locationName" ? "location" : "pharmacy"
          }`;
        }
      } else if (!formData[key]) {
        newInvalidFields[key] = `Please enter ${
          formFields.find((f) => f.id === key)?.label
        }`;
      }
    });
    setInvalidFields(newInvalidFields);
    return Object.keys(newInvalidFields).length === 0;
  };

  const handleSave = async (e) => {
    // console.log("hello");
    e.preventDefault();
    if (!validateForm()) return;

    const medicineData = {
      locationId: formData.locationName._id,
      tenantId: Cookies.get("TenantId"),
      practitionerId: profileData._id,
      pharmacyName: formData.pharmacyName.name,
      pharmacyId: formData.pharmacyName._id,
      ...Object.fromEntries(
        Object.entries(formData)?.filter(
          ([key, value]) =>
            !["locationName", "pharmacyName"].includes(key) && value !== ""
        )
      ),
    };
 
    try {
      if (medicineId) {
        await dispatch(
          updateMedicine({
            medId: medicineId,
            body: medicineData,
          })
        ).unwrap();
        toast.success("Medicine updated successfully!");
      } else {
        await dispatch(createMedicine(medicineData)).unwrap();
        toast.success("Medicine created successfully!");
      }
      navigate("/medicines");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => {
        dispatch(clearMadicinesError());
      }, 2000);
    }
  }, [error]);

  const renderField = (field) => {
    if (field.type === "date") {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={field.label}
            disablePast
            inputFormat="DD-MM-YYYY"
            views={["year", "month", "day"]}
            openTo="day"
            value={formData.expiryDate && dayjs(formData.expiryDate).isValid()
              ? dayjs(formData.expiryDate)
              : null}
            // onChange={(date) => {handleDateChange(field.id, date)}}
            onChange={(newValue) => {
              // Only update if valid
              if (newValue && dayjs(newValue).isValid()) {
                handleDateChange(field.id, newValue);
              }
            }}
            onError={(reason, value) => {
              // Optional: console log or track invalid date entries
              if (reason) console.warn("Invalid date:", value);
            }}
            renderInput={(params) => <CustomInput {...params} />}
            
            slotProps={{
              textField: {
                error: invalidFields[field.id],
                sx: {
                  "marginTop":"23px",
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#D1D5DB'
                    },
                    '&:hover fieldset': {
                      borderColor: '30#D1D5DB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#64c6b0',
                      borderWidth: '1px'
                    },
                    '&.Mui-error fieldset': {
                      borderColor: 'red'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 8px) scale(1)'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    transform: 'translate(14px, -9px) scale(0.75)'
                  },
                  '& .MuiInputLabel-root.MuiFormLabel-filled': {
                    transform: 'translate(14px, -9px) scale(0.75)'
                  }
                }
              }
            }}
          />
        </LocalizationProvider>
      );
    }
    return (
      <CustomInput
        type={field.type}
        id={field.id}
        label={field.label}
        placeholder={field.placeholder}
        value={formData[field.id]}
        onChange={(e) => handleChange(field.id, e.target.value)}
        isInvalid={invalidFields[field.id]}
        required={field.required}
      />
    );
  };

  return (
    <div className="h-full bg-gray-50 p-2 ">
   {/* {  isLoading ? <Loader/>: */}
      <div className="mx-auto h-full bg-white rounded-lg shadow-sm p-2">
 
        <form className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col ">
              <CommonLocationSelect
                locations={locations}
                value={formData.locationName}
                onChange={handleLocationSelect}
                onClear={() => handleLocationSelect(null)}
                isInvalid={invalidFields.locationName}
              />
            </div>
            <div className="flex flex-col  -mt-1">
              <CustomSelect
                id="pharmacyName"
                label="Pharmacy"
                value={formData.pharmacyName?._id || ""}
                options={availablePharmacies}
                onChange={(e) => handlePharmacySelect(e.target.value)}
                isInvalid={invalidFields.pharmacyName}
                isDisabled={!formData.locationName}
                required={true}
              />
            </div>
            {formFields.map((field) => (
              <div key={field.id} className="flex flex-col">
                {renderField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <CustomButton
              text={medicineId ? "Update" : "Save"}
              onclick={handleSave}
            />
          </div>
        </form>
  
       
      </div>
    {/* }  */}
    </div>
  );
};

export default AddMedicines;
