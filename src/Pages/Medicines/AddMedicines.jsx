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
import { formFields } from "./MedicinesData";
import { fetchLocations } from "../../Store/locationSlice";
import { createMedicine, getMedicineById, updateMedicine } from "../../Store/MedicinesSlice";

const INITIAL_FORM_STATE = {
  locationName: null,
  pharmacyName: null,
  medicineName: "",
  genericName: "",
  category: "",
  marketedBy: "",
  manufacturedBy: "",
  unit: "",
  rackName: "",
  hsnCode: "",
  snowmedCtCode: "",
  gstPercentage: "",
  minQuantity: "",
  maxQuantity: "",
  noOfUnit: "",
  sale: "",
  mrpPerUnit: "",
  expiryDate: null,
  prescriptionRequired: false,
  enable: false,
};

const REQUIRED_FIELDS = [
  "locationName",
  "pharmacyName",
  "medicineName",
  "unit",
  "gstPercentage",
  "noOfUnit",
  "mrpPerUnit",
  "expiryDate"
];

const AddMedicines = () => {
  const { locations } = useSelector((state) => state.locations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [invalidFields, setInvalidFields] = useState({});
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const medicineId = searchParams.get("id");

  console.log(formData)

  useEffect(() => {
    if (!locations?.length) {
      dispatch(fetchLocations({ currentPage: null, itemsPerPage: null, sortBy: 'name', order: 'desc' }));
    }
  }, [dispatch, locations]);

  useEffect(() => {
    const fetchMedicineData = async () => {
      if (!medicineId) return;
      
      setIsLoading(true);
      try {
        const medicineData = await dispatch(getMedicineById(medicineId)).unwrap();
        console.log("API Response:", medicineData);

        if (!medicineData || !medicineData.locationId) {
          throw new Error("Medicine data not found");
        }
        const locationObj = locations.find(loc => loc._id === medicineData.locationId);
        if (!locationObj) {
          throw new Error(`Location not found for ID: ${medicineData.locationId}`);
        }
        const pharmacyOptions = locationObj.pharmacy?.map(p => ({
          value: p._id,
          label: p.name,
          ...p
        })) || [];
        setAvailablePharmacies(pharmacyOptions);

        const pharmacyObj = locationObj.pharmacy?.find(p => p._id === medicineData.pharmacyId);
        if (!pharmacyObj) {
          throw new Error(`Pharmacy not found for ID: ${medicineData.pharmacyId}`);
        }
        const formattedData = {
          ...medicineData,
          locationName: locationObj,
          pharmacyName: pharmacyObj,
          expiryDate: dayjs(medicineData.expiryDate),
          enable: medicineData.enable || false,
          prescriptionRequired: medicineData.prescriptionRequired || false
        };

        setFormData(formattedData);
        setIsEditMode(true);
      } catch (error) {
        console.error("Error fetching medicine:", error);
        toast.error(error.message || "Failed to fetch medicine details");
        setTimeout(() => navigate("/Medicines"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (medicineId && locations?.length) {
      fetchMedicineData();
    }
  }, [medicineId, locations, dispatch, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value != null && value !== "") {
      setInvalidFields(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationSelect = (location) => {
    handleChange("locationName", location);
    handleChange("pharmacyName", null);
    
    const pharmacyOptions = location?.pharmacy?.map(p => ({
      value: p._id,
      label: p.name,
      ...p
    })) || [];
    
    setAvailablePharmacies(pharmacyOptions);
  };

  const handlePharmacySelect = (selectedPharmacyId) => {
    if (!selectedPharmacyId) {
      handleChange("pharmacyName", null);
      return;
    }

    const pharmacy = availablePharmacies.find(p => p._id === selectedPharmacyId);
    if (pharmacy) {
      const { value, label, ...pharmacyData } = pharmacy;
      handleChange("pharmacyName", pharmacyData);
    }
  };

  const validateForm = () => {
    const newInvalidFields = {};
    
    REQUIRED_FIELDS.forEach(key => {
      if (key === "locationName" || key === "pharmacyName") {
        if (!formData[key]?._id) {
          newInvalidFields[key] = `Please select a ${key === "locationName" ? "location" : "pharmacy"}`;
        }
      } else if (!formData[key]) {
        newInvalidFields[key] = `Please enter ${formFields.find(f => f.id === key)?.label}`;
      }
    });
    setInvalidFields(newInvalidFields);
    return Object.keys(newInvalidFields).length === 0;
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const medicineData = {
      locationName: formData.locationName.name,
      locationId: formData.locationName._id,
      pharmacyName: formData.pharmacyName.name,
      pharmacyId: formData.pharmacyName._id,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => 
          !["locationName", "pharmacyName"].includes(key) && value !== ""
        )
      )
    };
  
    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await dispatch(updateMedicine({ 
          medId: medicineId,
          body: medicineData 
        })).unwrap();
        toast.success("Medicine updated successfully!");
      } else {
        await dispatch(createMedicine(medicineData)).unwrap();
        toast.success("Medicine created successfully!");
      }
      navigate("/Medicines");
    } catch (error) {
      toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} medicine`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            value={formData.expiryDate}
            onChange={(date) => handleChange(field.id, date)}
            renderInput={(params) => <CustomInput {...params} />}
            isInvalid={invalidFields[field.id]}
            sx={{
              '& .MuiInputLabel-root': { top: '15px' },
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: 2,
                border: "1px solid gray",
                marginTop: "23px",
              },
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
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto bg-white rounded-lg shadow-sm p-2">
        <form className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col ">
              <CommonLocationSelect
                locations={locations}
                value={formData.locationName}
                onChange={handleLocationSelect}
                onClear={() => handleLocationSelect(null)}
              />
            </div>
            <div className="flex flex-col mb-1">
              <CustomSelect
                id="pharmacyName"
                label="Pharmacy"
                value={formData.pharmacyName?._id || ''}
                options={availablePharmacies}
                onChange={(e) => handlePharmacySelect(e.target.value)}
                isInvalid={invalidFields.pharmacyName}
                isDisabled={!formData.locationName}
                isClearable
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
              text={isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Save")}
              onclick={handleSave}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicines;