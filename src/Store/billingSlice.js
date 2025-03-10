import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { setStatusFail } from "./statusFailSlice";
import { serviceData } from "../Pages/Billing/billingdata";

const initialState = {
  billing: {},        
  billings: [],     
  totalPages: 0, 
  error: null,
  isLoading: false,
  practitioners:null,
  serviceData:null
};


const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;
export const createBilling = createAsyncThunk(
  "billing/createBilling",
  async (body, { rejectWithValue ,dispatch}) => {
    try {
      const response = await axios.post(
        `${ADMIN_URL}/billing`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("Token")}`,
            tenantId: Cookies.get("TenantId"),
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

export const getBillingById = createAsyncThunk(
  "billing/getBillingById",
  async (billId, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/billing/${billId}`, {
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


export const getAllBillings = createAsyncThunk(
  "billing/getAllBillings",
  async ({ currentPage, itemsPerPage, sortBy, order,doctorId }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/billing`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          order,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantid: Cookies.get("TenantId"),
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

export const updateBilling = createAsyncThunk(
  "billing/updateBilling",
  async ({ billId, body }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.patch(
        `${ADMIN_URL}/billing/${billId}`,
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

export const getservicesData = createAsyncThunk(
  "billing/getservicesData",
  async ({type,locationId}, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/${type}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          "location-id":locationId,
          tenantid: Cookies.get("TenantId"),
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
)

export const getAllLocationPractitioners = createAsyncThunk(
  "billing/getAllLocationPractitioners",
  async ({ locationId ,userType}, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles/location-profile`, {
     
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantid: Cookies.get("TenantId"),
          locationid:locationId,
          usertype:userType
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

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearBillingError:(state)=>{
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBilling.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBilling.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billing = action.payload; 
      })
      .addCase(createBilling.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      .addCase(getBillingById.pending, (state) => {
        state.billingStatus = "loading";
        state.error = null;
      })
      .addCase(getBillingById.fulfilled, (state, action) => {
        state.billingStatus = "succeeded";
        state.billing = action.payload; 
      })
      .addCase(getBillingById.rejected, (state, action) => {
        state.billingStatus = "failed";
        state.error = action.payload; 
      })

      .addCase(getAllBillings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBillings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billings = action.payload.data;
        state.totalPages = action.payload.totalPages; 
      })
      .addCase(getAllBillings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      .addCase(updateBilling.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billing = action.payload; 
      })
      .addCase(updateBilling.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      .addCase(getAllLocationPractitioners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllLocationPractitioners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practitioners = action.payload; 
      })
      .addCase(getAllLocationPractitioners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      .addCase(getservicesData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getservicesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceData = action.payload.data; 
      })
      .addCase(getservicesData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      ;
  },
});

export const {clearBillingError} = billingSlice.actions
export default billingSlice.reducer;
