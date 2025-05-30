import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CustomDatePicker = ({id,label,value,isInvalid,errorMessage,onChange,required}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1 z-30">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label} {required &&<span className="text-red-500">*</span>}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DatePicker
          id={id}
          value={value ? dayjs(value) : null}
          onChange={(newValue) => {
            const formattedValue = newValue ? newValue.format("YYYY-MM-DD") : "";
            onChange(id, formattedValue);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '40px',
              borderRadius: 2,
              '& fieldset': {
                borderColor: isInvalid ? 'red !important' : '#ccc',
                borderWidth: '0.5px',
                boxShadow: isInvalid ? '0 0.5px 0 red !important' : '0 0.5px 0 transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#64c6b0 !important',
                boxShadow: '0 0.5px 0 #64c6b0 !important',
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={isInvalid}
              helperText={isInvalid ? errorMessage : ""}
              variant="outlined"
              size="small"
            />
          )}
          inputFormat="DD-MM-YYYY"
          disableFuture
          views={["year", "month", "day"]}
          openTo="day"
        />
      </LocalizationProvider>
      {
        isInvalid && <p className="text-[12px] text-red-700">{isInvalid}</p>
      }
    </div>
  );
};

export default CustomDatePicker;
