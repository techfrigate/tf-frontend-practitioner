import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  patients: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
  totalPages: 1,
  patient: null, // Add a new state for a single patient
};

const BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmEyNmExNmRlYjZiNWEzMGU0NGQ1NDQiLCJ1c2VyVHlwZSI6ImRvY3RvciIsImlhdCI6MTcyMjI0MjQ4NSwiZXhwIjoxNzIyMjUzMjg1fQ.kgSZz0pHrlvrx4SWp2leVX5rAT5UMoEKPFC0WcklKPg';
const TENANT_ID = '667d5e70038302060ee7370f';

export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profiles`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "tenantid": TENANT_ID,
          "usertype": "patient"
        },
        params: {
          page,
          limit
        }
      });
      return { data: response.data.profiles, totalPages: response.data.totalPages };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const addPatient = createAsyncThunk(
  'patient/addPatient',
  async (newPatient, { rejectWithValue }) => {
    const { phoneNumber, dialCode, address1, address2, city, state, country, zipCode, ...rest } = newPatient;

    const body = {
      ...rest,
      phoneNumber: {
        dialCode,
        value: phoneNumber
      },
      address: {
        addressLine1: address1,
        addressLine2: address2,
        city, state, country, zipCode
      },
      tenantId: TENANT_ID
    };
    try {
      const response = await axios.post(`${BASE_URL}/profiles`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
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
  async ({ id, userId, updates }, { rejectWithValue }) => {
    console.log(updates,"updates");
    const { phoneNumber, dialCode, address1, address2, city, state, country, zipCode, ...rest } = updates;

    const body = {
      ...rest,
      phoneNumber: {
        dialCode,
        value: phoneNumber
      },
      address: {
        addressLine1: address1,
        addressLine2: address2,
        city, state, country, zipCode
      },
    };

    try {
      const response = await axios.patch(`${BASE_URL}/profiles/${id}/${userId}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      });
      console.log(response.data);
      window.location.href= "http://localhost:3001/patients"
      return response.data;
    } catch (error) {
      console.log(error);
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
