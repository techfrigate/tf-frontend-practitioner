import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  patient: {},
  status: "idle",
  error: null,
};

export const savePatient = createAsyncThunk(
  "patient/savePatient",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/patients", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to save patient data"
      );
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatientData: (state, action) => {
      // console.log("Updating state with:", action.payload);
      state.patient = {
        ...state.patient,
        ...action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(savePatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(savePatient.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(savePatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPatientData } = patientSlice.actions;
export default patientSlice.reducer;
