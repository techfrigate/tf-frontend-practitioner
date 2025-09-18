import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
import { setStatusFail } from "./statusFailSlice";
const initialState = {
  patients: [],
  isLoading: false,
  error: null,
  saveStatus: false,
  saveError: null,
  totalPages: 1,
  patient: null,  
};
 
const ACCOUNTS_URL  = process.env.REACT_APP_ACCOUNTS_URL
const ADMIN_URL =  process.env.REACT_APP_ADMIN_URL
const PRACTITIONER_URL =  process.env.REACT_APP_PRACTITIONER_URL
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async ({ page, limit,order ,sortBy }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          "tenantid": Cookies.get("TenantId"),
          "usertype": "patient"
        },
        params: {
          page,
          limit,
          order,sortBy
        }
      });
     
      return { data: response.data.data.profiles, totalPages: response.data.data.totalPages };
    } catch (error) {
      console.log(error,"error")
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
);

export const addPatient = createAsyncThunk(
  'patient/addPatient',
  async (newPatient, { rejectWithValue,dispatch }) => {
  
    try {
      const response = await axios.post(`${ACCOUNTS_URL}/profiles/practioner-profile`, newPatient, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
     return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (id, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
        }
      });
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
);

export const patchPatientById = createAsyncThunk(
  'patient/patchPatientById',
  async ({ id, userId, updates}, { rejectWithValue,dispatch }) => { 

    try {
      const response = await axios.patch(`${ACCOUNTS_URL}/profiles/${id}/${userId}`, updates, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
);

export const patchPatientByIdStatus = createAsyncThunk(
  'patient/patchPatientByIdStatus',
  async ({ id, userId, updates}, { rejectWithValue,dispatch }) => { 
    const tenantId =  Cookies.get("TenantId")
    try {
      const response = await axios.patch( `${ACCOUNTS_URL}/profiles/update-profile-status/${id}/${tenantId}/patient`, updates, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
      return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.saveError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addPatient.pending, (state) => {
        state.saveStatus = true;
        state.saveError = null
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.saveStatus = false;
        state.patients.push(action.payload);
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.saveStatus = false;
        state.saveError = action.payload || action.error.message;
      })

      .addCase(fetchPatientById.pending, (state) => {
        state.status = true;
        state.error =null
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.status = false;
        state.patient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.status = false;
        state.error = action.payload || action.error.message;
      })
      
      .addCase(patchPatientById.pending, (state) => {
        state.saveStatus = true;
        state.saveError=null
      })
      .addCase(patchPatientById.fulfilled, (state, action) => {
        state.saveStatus = false;
        const index = state.patients.findIndex(patient => patient._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
          state.patient= null
        }
      })
      .addCase(patchPatientById.rejected, (state, action) => {
        state.saveStatus = false;
        state.saveError = action.payload || action.error.message;
      })
      .addCase(patchPatientByIdStatus.pending, (state) => {
        state.saveStatus = true;
        state.saveError=null
      })
      .addCase(patchPatientByIdStatus.fulfilled, (state, action) => {
        state.saveStatus = false;
        const index = state.patients.findIndex(patient => patient._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
          state.patient= null
        }
      })
      .addCase(patchPatientByIdStatus.rejected, (state, action) => {
        state.saveStatus = false;
        state.saveError = action.payload || action.error.message;
      });
  }
});

export const {clearError} =  patientSlice.actions
export default patientSlice.reducer;
