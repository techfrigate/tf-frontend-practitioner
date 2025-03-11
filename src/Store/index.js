import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import rostersReducer from "./rosterSlice"
import slotsReducer from "./slotsSlice"
import locationsReducer from "./locationSlice";
import appointmentReducers from "./appointmentSlice"
import profileReducer from "./profileSlice"
import billingReducer from "./billingSlice"
import medicinesReducer from "./MedicinesSlice"
import formDataReducer from "./prescriptionformDataSlice"
import fhirReducer from "./fhirSlice"
import statusFailReducer from "./statusFailSlice"

export const store = configureStore({
  reducer: {
    patient: patientReducer ,
    billing: billingReducer ,
    locations: locationsReducer,
    medicines: medicinesReducer,
    rosters:rostersReducer,
    slots:slotsReducer,
    appointment:appointmentReducers,
    profile:profileReducer,
    formData: formDataReducer,
    fhir:fhirReducer,
    statusFail: statusFailReducer,
   },
});

export default store;
