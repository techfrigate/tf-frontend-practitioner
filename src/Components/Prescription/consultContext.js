import { createContext, useContext } from "react";

// Identifies the patient/tenant/practitioner of the consultation the prescription forms write to.
export const ConsultContext = createContext({
  tenantId: undefined,
  patientRef: undefined,
  practitioner: undefined,
});

export const useConsult = () => useContext(ConsultContext);
