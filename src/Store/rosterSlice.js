import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from "js-cookie"
import { setStatusFail } from './statusFailSlice';
// Define the initial state
const initialState = {
  rosterStatus:"idle",
  rostersData: [],
  error: null,
};

 
const ACCOUNTS_URL  = process.env.REACT_APP_ACCOUNTS_URL
const ADMIN_URL =  process.env.REACT_APP_ADMIN_URL

// Create an async thunk to get rosters
export const getRosters = createAsyncThunk(
  'rosters/getRosters',
  async (Profileid, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/rosters/practitioner-roster/${Profileid}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantid:Cookies.get("TenantId")
        },
      });
      console.log(response.data);
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

// Create the slice
const rosterSlice = createSlice({
  name: 'rosters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRosters.pending, (state) => {
        state.rosterStatus = 'loading'; 
      })
      .addCase(getRosters.fulfilled, (state, action) => {
        state.rosterStatus = 'succeeded';
        state.rostersData = action.payload;
        state.error = null;
      })
      .addCase(getRosters.rejected, (state, action) => {
        state.rosterStatus = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default rosterSlice.reducer;
