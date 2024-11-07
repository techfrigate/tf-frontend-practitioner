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

export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          "tenantid": Cookies.get("TenantId"),
          "usertype": "patient"
        },
        params: {
          page,
          limit
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
    const { phoneNumber, dialCode, address1, address2, city, state, country, zipCode,tenantName, ...rest } = newPatient;

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
      tenants:[
        {
          tenantId: Cookies.get("TenantId"),
          tenantName,
          userType:'patient'
        }
      ]
    };


    try {
      const response = await axios.post(`${ACCOUNTS_URL}/profiles/practioner-profile`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
      console.log(response.data,"user res")
      window.location.href=   "http://localhost:3005/patients"
      return response.data;
    } catch (error) {
      console.log(error, "user error");
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
      const response = await axios.patch(`${ACCOUNTS_URL}/profiles/${id}/${userId}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`
        }
      });
      console.log(response.data);
      window.location.href= "http://localhost:3005/patients"
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
