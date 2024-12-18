import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CustomDatePicker = ({
  id,
  label,
  value,
  isInvalid,
  errorMessage,
  onChange,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 ">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
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
              border:"1px soild gray"
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
    </div>
  );
};

export default CustomDatePicker;
