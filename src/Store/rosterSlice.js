import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    rosterStatus:"idel",
  rostersData: [],
  error: null,
};

const BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmExMzFkZWMxMzE2YTFjYzg3YzM5NTMiLCJ1c2VyVHlwZSI6ImRvY3RvciIsImlhdCI6MTcyMjQxMDM3NCwiZXhwIjoxNzIyNDIxMTc0fQ.P6TWAaidEyosGJDlKQtuW_f9t3uunWeU1YfLz-O5QUE';
const TENANT_ID = '667d5e70038302060ee7370f';

// Create an async thunk to get rosters
export const getRosters = createAsyncThunk(
  'rosters/getRosters',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/rosters/practitioner-roster/${userId}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
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
