import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { setStatusFail } from "./statusFailSlice";

const initialState = {
  locations: [],
  location: {},
  profileLocations:[],
  totalPages: 1,
  fetchStatus: "idle",
  error: null,
  deletError: null,
};

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async ({ currentPage, itemsPerPage, sortBy, order }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/locations`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          order,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantId: Cookies.get("TenantId"),
        },
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

export const fetchLocationById = createAsyncThunk(
  "locations/fetchLocationById",
  async ({ locationsId }, { rejectWithValue, dispatch }) => {
    try {
      const idResponses = await Promise.all(
        locationsId.map(async (id) => {
          try {
            const res = await axios.get(`${ADMIN_URL}/locations/${id}`, {
              headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                tenantId: Cookies.get("TenantId"),
              },
            });
           
            return res.data.data;
          } catch (err) {
            console.error(`Failed to fetch details for ID: ${id}`, err);
            return null;
          }
        })
      );
      return idResponses;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
             const route = "/status-failed"
             await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
           }
       return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
     }
  }
);


const locationsSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchLocations.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.locations = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLocationById.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.profileLocations = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })
    },
});

export default locationsSlice.reducer;