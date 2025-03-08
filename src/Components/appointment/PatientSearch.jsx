import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
const PatientSearch = ({ handlePatientSelect }) => {
  const [patientOptions, setPatientOptions] = useState([]);
  const { patients:patientsData,isLoading,error} = useSelector((state) => state.patient);
  const calculatePreciseAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
  
    const ageInMilliseconds = today - dob;
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;  
    const preciseAge = ageInMilliseconds / millisecondsInYear;
    console.log(preciseAge, "precise age");
    return preciseAge.toFixed(1);
  };

  useEffect(() => {
    const patients = patientsData
      .filter(patient => patient.tenants.find(tenant => tenant.status && tenant.tenantId === Cookies.get("TenantId") && tenant.userType === "patient"))
      .map((patient) => ({
        name: `${patient?.firstName} ${patient?.lastName}`,
        age: calculatePreciseAge(patient.dob),
        image: patient.imageUrl || "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
        data: patient,
      }));
    setPatientOptions(patients);
  }, [patientsData]);



  return (
    <Autocomplete
    sx={{ width: "100%", "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
    },
    "& .MuiAutocomplete-paper": {
      borderRadius: "20px", 
      marginTop: "8px"
    } }}
      disablePortal
      options={patientOptions}
      getOptionLabel={(option) => option.name || ""}
      onChange={(event, value) => {
        if (!value?.data) {
          console.warn("No patient selected");
          handlePatientSelect(null);
        } else {
          console.log("Selected Patient:", value);
          handlePatientSelect(value.data);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Search Patient" />}
      renderOption={(props, option) => (
        <li {...props} key={option.data?._id || option.name}>
          <div className="flex items-center">
            <Avatar sx={{ mr: 2 }} alt={option.name} src={option.image} />
            <div>
              <p className="text-gray-800 font-semibold">{option.name}</p>
              <p className="text-gray-500 text-sm">Age: {option.age}</p>
            </div>
          </div>
        </li>
      )}
      loading={isLoading}
      loadingText="Loading patinets..."
      noOptionsText={isLoading ? "Loading..." : "No patients found"}
    />
  );
};

export default PatientSearch;
