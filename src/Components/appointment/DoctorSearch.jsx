import React, { memo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearSlotError } from "../../Store/slotsSlice";

const DoctorSearch = ({ handleDoctorSelect }) => {
  const [doctorOptions, setDoctorOptions] = useState([]);
  const { slotsData, isLoading, error } = useSelector((state) => state.slots);
  const dispatch = useDispatch();
  const convertExperience = (value) => {
    const rem = value % 12;
    const num = Math.floor(value / 12);
    return `${num}.${rem}`;
  };

  useEffect(() => {
    const uniqueDoctorIds = new Set();
    
    const doctors = slotsData
      .filter((doc) => {
        const isValidDoctor = doc.practitionerData.tenants.find(
          (tenant) => 
            tenant.status && 
            tenant.tenantId === Cookies.get("TenantId") && 
            tenant.userType === "practitioner"
        );
        const doctorId = doc.practitionerData._id || doc.practitionerId;
        const isDuplicate = uniqueDoctorIds.has(doctorId);
        if (isValidDoctor && !isDuplicate) {
          uniqueDoctorIds.add(doctorId);
          return true;
        }
        return false;
      })
      .map((doc) => ({
        name: `Dr. ${doc.practitionerData.firstName} ${doc.practitionerData.lastName}`,
        speciality:
          doc.practitionerData.work.speciality ||
          "Speciality not available",
        experience: convertExperience(
          doc.practitionerData.work.experience || 0
        ),
        image: doc.practitionerData.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ECZ28iBTpFlNtSadX7LKKBAcliGr1TXOiw&s",
        data: doc,
      }));
    
    setDoctorOptions(doctors);
  }, [slotsData]);
 
  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => {
        dispatch(clearSlotError())
      }, 2000)
    }
  }, [error]);
  
  return (
    <Autocomplete
      sx={{ 
        width: "100%", 
        "& .MuiOutlinedInput-root": {
          borderRadius: "20px",
        },
        "& .MuiAutocomplete-paper": {
          borderRadius: "20px", 
          marginTop: "8px"
        } 
      }}
      disablePortal
      options={doctorOptions}
      getOptionLabel={(option) => option.name || ""}
      onChange={(event, value) => {
        if (!value?.data) {
          handleDoctorSelect(null);
        } else {
          handleDoctorSelect(value.data);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Select Doctor" />}
      renderOption={(props, option) => (
        <li {...props} key={option.name}>
          <div className="flex items-center">
            <Avatar
              sx={{ mr: 2 }}
              alt={option.name}
              src={option.image}
            />
            <div>
              <p className="text-gray-800 font-semibold">{option.name}</p>
              <p className="text-gray-500 text-sm">{option.speciality}</p>
              <p className="text-gray-400 text-xs">
                {option.experience} years experience
              </p>
            </div>
          </div>
        </li>
      )}
      loading={isLoading}
      loadingText="Loading doctors..."
      noOptionsText={isLoading ? "Loading..." : "No doctors found"}
    />
  );
};

export default memo(DoctorSearch);