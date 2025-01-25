import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  billing: {},        
  billings: [],     
  totalPages: 0, 
  error: null,
  billingStatus: "idle",
};

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

export const createBilling = createAsyncThunk(
  "billing/createBilling",
  async (body, { rejectWithValue }) => {
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const getBillingById = createAsyncThunk(
  "billing/getBillingById",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/billing/${billId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
        },
      });
      console.log(response.data,"bill data")
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);


export const getAllBillings = createAsyncThunk(
  "billing/getAllBillings",
  async ({ currentPage, itemsPerPage, sortBy, order,doctorId }, { rejectWithValue }) => {
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
      console.log("Received billings:", response.data);  

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const updateBilling = createAsyncThunk(
  "billing/updateBilling",
  async ({ billId, body }, { rejectWithValue }) => {
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
      console.log(response.data)
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBilling.pending, (state) => {
        state.billingStatus = "loading";
        state.error = null;
      })
      .addCase(createBilling.fulfilled, (state, action) => {
        state.billingStatus = "succeeded";
        state.billing = action.payload; 
      })
      .addCase(createBilling.rejected, (state, action) => {
        state.billingStatus = "failed";
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
        state.billingStatus = "loading";
        state.error = null;
      })
      .addCase(getAllBillings.fulfilled, (state, action) => {
        state.billingStatus = "succeeded";
        state.billings = action.payload.data;
        state.totalPages = action.payload.totalPages; 
      })
      .addCase(getAllBillings.rejected, (state, action) => {
        state.billingStatus = "failed";
        state.error = action.payload; 
      })
      .addCase(updateBilling.pending, (state) => {
        state.billingStatus = "loading";
        state.error = null;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.billingStatus = "succeeded";
        state.billing = action.payload; 
      })
      .addCase(updateBilling.rejected, (state, action) => {
        state.billingStatus = "failed";
        state.error = action.payload; 
      });
  },
});

export default billingSlice.reducer;
