import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { editSlotStatus, getSlots } from "./slotsSlice";
import Cookies from "js-cookie";
import { setStatusFail } from "./statusFailSlice";

const initialState = {
  appointment: {},
  error: null,
  isLoading: false,
  prescriptionData: [],
 
};

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
const FHIR_URL = process.env.REACT_APP_FHIR_URL; 
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
     await dispatch(editSlotStatus({ slotDetailSlotId, slotId }));
      setShowPayment(true);
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response?.data?.error?.message || "Something went wrong");
    }
  }
);

// Get Prescriptions
export const getPrescriptions = createAsyncThunk(
  "prescription/getPrescriptions",
  async ({ practitionerId }, { rejectWithValue,dispatch }) => {
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
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response?.data?.error?.message || "Something went wrong");
    }
  }
);

// Update Appointment
export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment",
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
       
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response?.data?.error?.message || "Something went wrong");
    }
  }
);




const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError:(state)=>{
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      // createAppointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // getPrescriptions
      .addCase(getPrescriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prescriptionData = action.payload;
      })
      .addCase(getPrescriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updateAppointment
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    
  },
});
export const{clearAppointmentError} =  appointmentSlice.actions
export default appointmentSlice.reducer;
