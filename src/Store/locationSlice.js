import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

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
  async ({ currentPage, itemsPerPage, sortBy, order }, { rejectWithValue }) => {
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
      console.log(error, "caling");
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