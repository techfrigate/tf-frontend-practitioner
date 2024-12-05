import { Navigate } from "react-router-dom";
 
import ProtectedRoute from "./ProtectedRoute"
import { lazy } from "react";
const WorkList  =  lazy(()=>import("../Pages/WorkList/WorkList"))
const Calendar  =  lazy(()=>import("../Pages/Calendar/Calendar"))
const Billing  =  lazy(()=>import("../Pages/Billing/Billing"))
const CreateNewPatients  =  lazy(()=>import(".././components/Topbar/CreateNewPatients/CreateNewPatients"))
const Appointment  =  lazy(()=>import(".././components/Topbar/Appointment/Appointment"))
const Payment  =  lazy(()=>import(".././components/Payment/Payment"))
const Patients  =  lazy(()=>import("../Pages/Patients/Patients"))
const UnauthorizedModal  =  lazy(()=>import(".././components/Common/CustomButton"))
const NotFound  =  lazy(()=>import(".././components/Common/NotFound"))
const PatientInfoCategories =   lazy(()=>import("../Pages/Prescription/PatientInfoCategories"));

const routes = [
    { path: "/", component: <Navigate to="worklist"/> },
    { path: "/worklist", component: <ProtectedRoute><WorkList/></ProtectedRoute> },
    { path: "/patients", component: <ProtectedRoute><Patients/></ProtectedRoute> },
    { path: "/calendar", component: <ProtectedRoute><Calendar/></ProtectedRoute> },
    { path: "/billing", component: <ProtectedRoute><Billing/></ProtectedRoute> },
    { path: "/newPatients", component: <ProtectedRoute><CreateNewPatients/></ProtectedRoute> },
    { path: "/appointment", component: <ProtectedRoute><Appointment/></ProtectedRoute> },
    { path: "/payment", component: <ProtectedRoute><Payment/></ProtectedRoute> },
    { path: "/fillDetails",component: <ProtectedRoute><PatientInfoCategories /> </ProtectedRoute>},
    { path: "/unauthorized", component: <UnauthorizedModal/>},
    { path: "*", component: <NotFound/>},
    
]
 

export default routes;
