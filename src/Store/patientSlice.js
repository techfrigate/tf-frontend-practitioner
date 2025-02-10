import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
const initialState = {
  patients: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
  totalPages: 1,
  patient: null, // Add a new state for a single patient
};
 
const ACCOUNTS_URL  = process.env.REACT_APP_ACCOUNTS_URL
const ADMIN_URL =  process.env.REACT_APP_ADMIN_URL
const PRACTITIONER_URL =  process.env.REACT_APP_PRACTITIONER_URL
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async ({ page, limit,order }, { rejectWithValue }) => {
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
          order
        }
      });
      console.log(response.data,"patient data");
      return { data: response.data.profiles, totalPages: response.data.totalPages };
    } catch (error) {
      console.log(error,"patient error");
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const addPatient = createAsyncThunk(
  'patient/addPatient',
  async (newPatient, { rejectWithValue }) => {
  
    try {
      const response = await axios.post(`${ACCOUNTS_URL}/profiles/practioner-profile`, newPatient, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
     return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const patchPatientById = createAsyncThunk(
  'patient/patchPatientById',
  async ({ id, userId, updates}, { rejectWithValue }) => { 

    try {
      const response = await axios.patch(`${ACCOUNTS_URL}/profiles/${id}/${userId}`, updates, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      .addCase(addPatient.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.patients.push(action.payload);
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload || action.error.message;
      })

      .addCase(fetchPatientById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      .addCase(patchPatientById.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(patchPatientById.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        const index = state.patients.findIndex(patient => patient._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
          state.patient= null
        }
      })
      .addCase(patchPatientById.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload || action.error.message;
      });
  }
});

export default patientSlice.reducer;
