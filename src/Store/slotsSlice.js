import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  slotsData: [],
  slotsStatus: "idel",
  slotsError: null,
};

const BASE_URL = "http://localhost:3001/slots";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmIyZWI4MWYxNGRjNDA4YTE2N2Y3MGIiLCJ1c2VyVHlwZSI6InByYWN0aXRpb25lciIsImlhdCI6MTcyMzE3NTAwOSwiZXhwIjoxNzIzMTg1ODA5fQ.J0eewyt4P1SfbAk7YFC-30cyN-NHcQsn4zSmx6pCAQc";
const TENANT_ID = "66b1f56302c553a9091932be";

export const getSlots = createAsyncThunk(
  "slots/getSlots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
          tenantid: TENANT_ID,
        },
      });
     
      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const editSlotStatus = createAsyncThunk(
  "slots/editSlotStatus",
  async ({slotDetailSlotId,slotId},{dispatch,rejectWithValue})=>{
    try {

      const res =  await axios.patch(`${BASE_URL}/${slotId}`,{},{
        headers:{
             "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "slotid":slotDetailSlotId
        }
      })
      dispatch(getSlots());
      console.log(res,"slote update res",slotId,slotDetailSlotId);
    } catch (error) {
      return rejectWithValue("error")
    }
  }
)
export const slotsSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSlots.pending, (state) => {
        state.slotsStatus = "loading"
        state.slotsError = null
      })
      .addCase(getSlots.fulfilled, (state, action) => {
        state.slotsStatus = "succeeded"
        state.slotsData = action.payload;
      })
      .addCase(getSlots.rejected, (state, action) => {
        state.slotsStatus = "failed"
        state.slotsError = action.payload;
      });
  },
});

export default slotsSlice.reducer