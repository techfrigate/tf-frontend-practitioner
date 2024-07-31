import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import rostersReducer from "./rosterSlice"
export const store = configureStore({
  reducer: {
    patient: patientReducer ,
    rosters:rostersReducer
   },
});

export default store;
