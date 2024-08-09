import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { editSlotStatus, getSlots } from "./slotsSlice";

const initialState = {
  appointment: {},
  error: null,
  appointmentStatus: "idle", // Corrected typo from "idel" to "idle"
};


const BASE_URL = "http://localhost:3001/appointments";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmIyZWI4MWYxNGRjNDA4YTE2N2Y3MGIiLCJ1c2VyVHlwZSI6InByYWN0aXRpb25lciIsImlhdCI6MTcyMzE3NTAwOSwiZXhwIjoxNzIzMTg1ODA5fQ.J0eewyt4P1SfbAk7YFC-30cyN-NHcQsn4zSmx6pCAQc";
const TENANT_ID = "66b1f56302c553a9091932be";

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async ({body,slotDetailSlotId,slotId,setShowPayment}, { dispatch,rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, body, { 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log(response.data, "appointment data");
      dispatch(editSlotStatus({slotDetailSlotId,slotId}))
      setShowPayment(true);   
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async ({_id,body}, { dispatch,rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${_id}`, body, { 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);


const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.appointmentStatus = "loading";
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointmentStatus = "succeeded";
        state.appointment = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.appointmentStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
