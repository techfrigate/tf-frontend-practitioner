import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
import { setStatusFail } from "./statusFailSlice";
const initialState = {
  slotsData: [],
  slotsStatus: "idle",
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
      console.log(res,"slote update res",slotId,slotDetailSlotId);
    } catch (error) {
       if(error.response.data.errorCode == "STATUS_CHECK_TENANT_DENIED"){
              const route = "/status-failed"
              await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
            }
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