import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for FHIR APIs
const BASE_URL = process.env.REACT_APP_FHIR_URL;

// Async Thunk for creating a resource
export const createResource = createAsyncThunk(
  'fhir/createResource',
  async ({ resourceType, data }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/fhir-core/${resourceType}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data; // Return the response data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create resource'
      );
    }
  }
);

// Async Thunk for searching illness
export const searchIllness = createAsyncThunk(
  'fhir/searchIllness',
  async ({term,ecl}, thunkAPI) => {
    console.log(term,ecl)
    try {
      const response = await axios.get(`${BASE_URL}/fhir-core/snowstorm/illness?term=${term}&ecl=${ecl}`);
      console.log(response.data,"Search results");
      return response.data; // Return the response data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to search illness'
      );
    }
  }
);

  
// Initial state
const initialState = {
  resourceData: null,
  illnessData: null,
  loading: false,
  error: null,
  
};

// fhirSlice definition
const fhirSlice = createSlice({
  name: 'fhir',
  initialState,
  reducers: {
    resetState: (state) => {
      state.resourceData = null;
      state.illnessData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createResource lifecycle
    builder
    .addCase(createResource.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createResource.fulfilled, (state, action) => {
      state.loading = false;
      state.resourceData = action.payload;
    })
    .addCase(createResource.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // searchIllness lifecycle
    .addCase(searchIllness.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(searchIllness.fulfilled, (state, action) => {
      state.loading = false;
      state.illnessData = action.payload;
    })
     .addCase(searchIllness.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
 
  },
});

// Export actions
export const { resetState } = fhirSlice.actions;

// Export reducer
export default fhirSlice.reducer;
