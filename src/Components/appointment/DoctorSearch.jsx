import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";

const DoctorSearch = ({ slotsData, handleDoctorSelect }) => {
  const [doctorOptions, setDoctorOptions] = useState([]);

  const convertExperience = (value) => {
    const rem = value % 12;
    const num = Math.floor(value / 12);
    return `${num}.${rem}`;
  };
 console.log(slotsData,"slotsData")

  useEffect(() => {
    const doctors = slotsData
      .filter((doc) => doc.slots?.[0]?.practitionerData)
      .map((doc) => ({
        name: `Dr. ${doc.slots[0].practitionerData.firstName} ${doc.slots[0].practitionerData.lastName}`,
        speciality:
          doc.slots[0].practitionerData.work.speciality ||
          "Speciality not available",
        experience: convertExperience(
          doc.slots[0].practitionerData.work.experience || 0
        ),
        image: doc.slots[0].practitionerData.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ECZ28iBTpFlNtSadX7LKKBAcliGr1TXOiw&s",
        data: doc,
      }));
    setDoctorOptions(doctors);
  }, [slotsData]);

  return (
    <Autocomplete
      sx={{ width: "100%" }}
      disablePortal
      options={doctorOptions}
      getOptionLabel={(option) => option.name || ""}
      onChange={(event, value) => {
        if (!value?.data) {
          console.warn("No doctor selected");
          handleDoctorSelect(null);
        } else {
          console.log("Selected Doctor:", value);
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
    />
  );
};

export default DoctorSearch;
