import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
import { setStatusFail } from "./statusFailSlice";
const initialState = {
  slotsData: [],
  slotsStatus: "idle",
  isLoading:false,
  error: null,
  slotsError: null,
};

const ACCOUNTS_URL  = process.env.REACT_APP_ACCOUNTS_URL
const ADMIN_URL =  process.env.REACT_APP_ADMIN_URL

export const getSlots = createAsyncThunk(
  "slots/getSlots",
  async (_, { rejectWithValue ,dispatch}) => {
    try {
      const response = await axios.get(`${ADMIN_URL}/slots`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          tenantid: Cookies.get("TenantId"),
         // practitionerid:Cookies.get("UserId")
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


export const editSlotStatus = createAsyncThunk(
  "slots/editSlotStatus",
  async ({slotDetailSlotId,slotId},{dispatch,rejectWithValue})=>{
    try {

      const res =  await axios.patch(`${ADMIN_URL}/slots/${slotId}`,{},{
        headers:{
             "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Token")}`,
          "slotid":slotDetailSlotId
        }
      })
      dispatch(getSlots());
       
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
  }
)

export const slotsSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    clearSlotError:(state)=>{
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSlots.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSlots.fulfilled, (state, action) => {
        state.isLoading = false
        state.slotsData = action.payload;
      })
      .addCase(getSlots.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload;
      });
  },
});

export const {clearSlotError} =  slotsSlice.actions
export default slotsSlice.reducer