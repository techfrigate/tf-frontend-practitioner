import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
const initialState = {
  slotsData: [],
  slotsStatus: "idle",
  slotsError: null,
};

const BASE_URL = "http://localhost:3001/slots";

export const getSlots = createAsyncThunk(
  "slots/getSlots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantid: Cookies.get("TenantId"),
        },
      });
     console.log(response.data,"get slots data");
      return response.data;
    } catch (error) {
      console.log(error,"get slots error");
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
          Authorization: `Bearer ${Cookies.get("Token")}`,
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