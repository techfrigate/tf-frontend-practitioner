import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"
import { lazy } from "react";
import StatusFail from "../Components/Common/StatusFail";
 
const WorkList  =  lazy(()=>import("../Pages/WorkList/WorkList"))
const Calendar  =  lazy(()=>import("../Pages/Calendar/Calendar"))
const Billing  =  lazy(()=>import("../Pages/Billing/Billing"))
const CreateNewPatients  =  lazy(()=>import("../Pages/CreateNewPatient/CreateNewPatients"))
const CreateBill = lazy(()=>import("../Pages/Billing/AddBill"))
const Appointment  =  lazy(()=>import("../Pages/Appointment/Appointment"))
const Payment  =  lazy(()=>import("../Components/Payment/Payment"))
const Patients  =  lazy(()=>import("../Pages/Patients/Patients"))
 const UnauthorizedModal  =  lazy(()=>import("../Components/Common/UnauthorizedModal"))
 const NotFound  =  lazy(()=>import("../Components/Common/NotFound"))
const PatientInfoCategories =   lazy(()=>import("../Pages/Prescription/PatientInfoCategories"));
const BillPage = lazy(() => import("../Pages/Billing/PaymentConfirmation"));
const HumanBody = lazy(() => import("../Pages/WorkList/HumanBody"));
const Medicines = lazy(() => import("../Pages/Medicines/Medicines"));
const AddMedicines = lazy(() => import("../Pages/Medicines/AddMedicines"));
const MedicalRackApp = lazy(() => import("../Pages/Medicines/MedicalShopRack"));

const routes = [
    { path: "/", component: <Navigate to="worklist"/> },
    { path: "/worklist", component: <ProtectedRoute><WorkList/></ProtectedRoute> },
    { path: "/patients", component: <ProtectedRoute><Patients/></ProtectedRoute> },
    { path: "/calendar", component: <ProtectedRoute><Calendar/></ProtectedRoute> },
    { path: "/billing", component: <ProtectedRoute><Billing/></ProtectedRoute> },
    { path: "/new-patient", component: <ProtectedRoute><CreateNewPatients/></ProtectedRoute> },
    { path: "/add-bill", component: <ProtectedRoute><CreateBill/></ProtectedRoute> },
    { path: "/HumanBody", component: <ProtectedRoute><HumanBody/></ProtectedRoute> },
    { path: "/medicines", component: <ProtectedRoute><Medicines/></ProtectedRoute> },
    { path: "/add-medicine", component: <ProtectedRoute><AddMedicines/></ProtectedRoute> },
    { path: "/MedicalRackApp", component: <ProtectedRoute><MedicalRackApp/></ProtectedRoute> },
    { path: "/paymentconfirmation", component: <ProtectedRoute><BillPage/></ProtectedRoute> },
    { path: "/appointment", component: <ProtectedRoute><Appointment/></ProtectedRoute> },
    { path: "/payment", component: <ProtectedRoute><Payment/></ProtectedRoute> },
    { path: "/fillDetails",component: <ProtectedRoute><PatientInfoCategories /> </ProtectedRoute>},
    { path: "/unauthorized", component: <UnauthorizedModal/>},
    { path: "/status-failed", component: <StatusFail/> },
    { path: "*", component: <NotFound/>},
    
]
 

export default routes;
