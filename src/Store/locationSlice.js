import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { setStatusFail } from "./statusFailSlice";

const initialState = {
  locations: [],
  location: {},
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
      return response.data;
    } catch (error) {
     if(error.response.data.errorCode == "STATUS_CHECK_TENANT_DENIED"){
            const route = "/status-failed"
            await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
          }
      return rejectWithValue(error.response.data.message);
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
    },
});

export default locationsSlice.reducer;