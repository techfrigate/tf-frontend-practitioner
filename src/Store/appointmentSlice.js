import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { editSlotStatus, getSlots } from "./slotsSlice";
import Cookies from "js-cookie";

const initialState = {
  appointment: {},
  error: null,
  appointmentStatus: "idle",
  prescriptionData: [],
};

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

// Create Appointment
export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async ({ body, slotDetailSlotId, slotId, setShowPayment }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ADMIN_URL}/appointments`,
        { ...body, tenantId: Cookies.get("TenantId") },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("Token")}`,
          },
        }
      );
      console.log(response.data, "appointment data");
      dispatch(editSlotStatus({ slotDetailSlotId, slotId }));
      setShowPayment(true);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get Prescriptions
export const getPrescriptions = createAsyncThunk(
  "prescription/getPrescriptions",
  async ({ practitionerId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ADMIN_URL}/appointments/practitioner-appointments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("Token")}`,
            tenantid: Cookies.get("TenantId"),
            practitionerid: practitionerId,
          },
        }
      );
      console.log(response.data, "get Prescriptions data");
      return response.data;
    } catch (error) {
      console.log(error, "get Prescriptions error");
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

// Update Appointment
export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment", // changed action name
  async ({ _id, body }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${ADMIN_URL}/appointments/${_id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("Token")}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createAppointment
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
      })

      // getPrescriptions
      .addCase(getPrescriptions.pending, (state) => {
        state.appointmentStatus = "loading";
        state.error = null;
      })
      .addCase(getPrescriptions.fulfilled, (state, action) => {
        state.appointmentStatus = "succeeded";
        state.prescriptionData = action.payload;
      })
      .addCase(getPrescriptions.rejected, (state, action) => {
        state.appointmentStatus = "failed";
        state.error = action.payload;
      })

      // updateAppointment
      .addCase(updateAppointment.pending, (state) => {
        state.appointmentStatus = "loading";
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.appointmentStatus = "succeeded";
        state.appointment = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.appointmentStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
