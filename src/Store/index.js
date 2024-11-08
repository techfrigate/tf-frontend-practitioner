import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import rostersReducer from "./rosterSlice"
import slotsReducer from "./slotsSlice"
import appointmentReducers from "./appointmentSlice"
import profileReducer from "./profileSlice"
import formDataReducer from "./prescriptionformDataSlice"
export const store = configureStore({
  reducer: {
    patient: patientReducer ,
    rosters:rostersReducer,
    slots:slotsReducer,
    appointment:appointmentReducers,
    profile:profileReducer,
  formData: formDataReducer
   },
});

export default store;
