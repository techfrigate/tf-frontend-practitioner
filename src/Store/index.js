import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import rostersReducer from "./rosterSlice"
import slotsReducer from "./slotsSlice"
import appointmentReducers from "./appointmentSlice"
export const store = configureStore({
  reducer: {
    patient: patientReducer ,
    rosters:rostersReducer,
    slots:slotsReducer,
    appointment:appointmentReducers
   },
});

export default store;
