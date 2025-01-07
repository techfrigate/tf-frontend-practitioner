import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import rostersReducer from "./rosterSlice"
import slotsReducer from "./slotsSlice"
import locationsReducer from "./locationSlice";
import appointmentReducers from "./appointmentSlice"
import profileReducer from "./profileSlice"
import billingReducer from "./billingSlice"
import formDataReducer from "./prescriptionformDataSlice"
export const store = configureStore({
  reducer: {
    patient: patientReducer ,
    billing: billingReducer ,
    locations: locationsReducer,
    rosters:rostersReducer,
    slots:slotsReducer,
    appointment:appointmentReducers,
    profile:profileReducer,
  formData: formDataReducer
   },
});

export default store;
