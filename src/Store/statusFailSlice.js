import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  tenantObjects: null,
  navigate:null
};

const statusFailSlice = createSlice({
  name: "statusFail",
  initialState,
  reducers: {
    setStatusFail: (state, action) => {
       
      window.history.pushState({}, "", action.payload.navigate);
      window.dispatchEvent(new Event("customRouteChange"));
      state.tenantObjects = action.payload.tenants || null
    },  
    
  },
});

export const { setStatusFail, clearStatusFail } = statusFailSlice.actions;
export default statusFailSlice.reducer;
