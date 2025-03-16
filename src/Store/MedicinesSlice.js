import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { setStatusFail } from "./statusFailSlice";

const initialState = {
  medicine: {},        
  medicines: [],       
  totalPages: 1,       
  error: null,         
  medicineStatus: "idle",
  isLoading: false,
  pharmacies:null
};

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

export const createMedicine = createAsyncThunk(
  "medicines/createMedicine",
  async (body, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.post(
        `${ADMIN_URL}/medicines`,
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

export const getAllMedicines = createAsyncThunk(
  "medicines/getAllMedicines",
  async ({ currentPage, itemsPerPage, sortBy, order,doctorId }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/medicines`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          order,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantId: Cookies.get("TenantId"),
          doctorId:doctorId,
        },
      });
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

export const getMedicineById = createAsyncThunk(
  "medicines/getMedicineById",
  async (medId, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/medicines/${medId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
        },
      });
    
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

export const updateMedicine = createAsyncThunk(
  "medicines/updateMedicine",
  async ({ medId, body }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.patch(
        `${ADMIN_URL}/medicines/${medId}`,
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

export const deleteMedicine = createAsyncThunk(
  "medicines/deleteMedicine",
  async (medId, { rejectWithValue ,dispatch}) => {
    try {
      // eslint-disable-next-line
      const response = await axios.delete(`${ADMIN_URL}/medicines/${medId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
        },
      });
      return medId;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response?.data?.error?.message || "Something went wrong");
    }
  }
);


export const getAllPharmacies = createAsyncThunk(
  "medicines/getAllPharmacies",
  async ({locationId}, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/pharmacy`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          'location-id':locationId,
          tenantId: Cookies.get("TenantId"),
        },
      });
      return response.data.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response?.data?.error?.message || "Something went wrong");
    }
  }
);

const medicinesSlice = createSlice({
  name: "medicines",
  initialState,
  reducers: {
    clearMadicinesError:(state)=>{
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.isLoading =false;
        state.medicine = action.payload;
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllMedicines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.isLoading =false;
        state.medicines = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMedicineById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicine = action.payload;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicine = action.payload;
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteMedicine.pending, (state) => {
        state.medicineStatus = "loading";
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicineStatus = "succeeded";
        state.medicines = state.medicines.filter(
          (medicine) => medicine.id !== action.payload
        );
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.medicineStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getAllPharmacies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPharmacies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pharmacies = action.payload;
      })
      .addCase(getAllPharmacies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      ;
  },
});

export const {clearMadicinesError} = medicinesSlice.actions
export default medicinesSlice.reducer;
