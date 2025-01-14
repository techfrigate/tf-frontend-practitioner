import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";

const PatientSearch = ({ patientsData, handlePatientSelect }) => {
  const [patientOptions, setPatientOptions] = useState([]);

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const patients = patientsData.map((patient) => ({
      name: `${patient?.firstName} ${patient?.lastName}`,
      age: calculateAge(patient.dob),
      image:
        "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
      data: patient,
    }));
    setPatientOptions(patients);
  }, [patientsData]);

  return (
    <Autocomplete
      sx={{ width: "100%" }}
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
    />
  );
};

export default PatientSearch;
