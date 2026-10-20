import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"
import { lazy } from "react";
import StatusFail from "../Components/Common/StatusFail";
const Appointments = lazy(() => import("../Pages/Appointments/Appointments"));
 
const WorkList  =  lazy(()=>import("../Pages/WorkList/WorkList"))
const Calendar  =  lazy(()=>import("../Pages/Calendar/Calendar"))
const Billing  =  lazy(()=>import("../Pages/Billing/Billing"))
const CreateNewPatients  =  lazy(()=>import("../Pages/CreateNewPatient/CreateNewPatients"))
const CreateBill = lazy(()=>import("../Pages/Billing/AddBill"))
const Appointment  =  lazy(()=>import("../Pages/Appointment/Appointment"))
const Patients  =  lazy(()=>import("../Pages/Patients/Patients"))
 const UnauthorizedModal  =  lazy(()=>import("../Components/Common/UnauthorizedModal"))
 const NotFound  =  lazy(()=>import("../Components/Common/NotFound"))
const PatientInfoCategories =   lazy(()=>import("../Pages/Prescription/PatientInfoCategories"));
const BillPage = lazy(() => import("../Pages/Billing/PaymentConfirmation"));
const HumanBody = lazy(() => import("../Pages/WorkList/HumanBody"));
const Medicines = lazy(() => import("../Pages/Medicines/Medicines"));
const AddMedicines = lazy(() => import("../Pages/Medicines/AddMedicines"));
const MedicalRackApp = lazy(() => import("../Pages/Medicines/MedicalShopRack"));
const Fhirdetails = lazy(() => import("../Components/Prescription/Fhirdetails"))
const BedBoard = lazy(() => import("../Pages/IPD/BedBoard"));
const PrescriptionComposer = lazy(() => import("../Pages/Rx/PrescriptionComposer"));
const PrescriptionView = lazy(() => import("../Pages/Rx/PrescriptionView"));
const PrescriptionList = lazy(() => import("../Pages/Rx/PrescriptionList"));
const AdmitPatient = lazy(() => import("../Pages/IPD/Admit"));
const Admissions = lazy(() => import("../Pages/IPD/Admissions"));
const AdmissionDetail = lazy(() => import("../Pages/IPD/AdmissionDetail"));    

const routes = [
    { path: "/", component: <Navigate to="/appointments"/> },
    { path: "/dashboard", component: <Navigate to="/appointments"/> },
    { path: "/appointments", component: <ProtectedRoute><Appointments/></ProtectedRoute> },
    { path: "/worklist", component: <ProtectedRoute><WorkList/></ProtectedRoute> },
    { path: "/ward", component: <Navigate to="/ipd" replace /> },
    { path: "/ipd", component: <ProtectedRoute><BedBoard/></ProtectedRoute> },
    { path: "/prescriptions", component: <ProtectedRoute><PrescriptionList/></ProtectedRoute> },
    { path: "/prescriptions/write", component: <ProtectedRoute><PrescriptionComposer/></ProtectedRoute> },
    { path: "/prescriptions/:id", component: <ProtectedRoute><PrescriptionView/></ProtectedRoute> },
    { path: "/ipd/admit", component: <ProtectedRoute><AdmitPatient/></ProtectedRoute> },
    { path: "/ipd/admissions", component: <ProtectedRoute><Admissions/></ProtectedRoute> },
    { path: "/ipd/admissions/:id", component: <ProtectedRoute><AdmissionDetail/></ProtectedRoute> },
    { path: "/patients", component: <ProtectedRoute><Patients/></ProtectedRoute> },
    { path: "/calendar", component: <ProtectedRoute><Calendar/></ProtectedRoute> },
    { path: "/billing", component: <ProtectedRoute><Billing/></ProtectedRoute> },
    { path: "/new-patient", component: <ProtectedRoute><CreateNewPatients/></ProtectedRoute> },
    { path: "/add-bill", component: <ProtectedRoute><CreateBill/></ProtectedRoute> },
    { path: "/HumanBody", component: <ProtectedRoute><HumanBody/></ProtectedRoute> },
    { path: "/medicines", component: <ProtectedRoute><Medicines/></ProtectedRoute> },
    { path: "/add-medicine", component: <ProtectedRoute><AddMedicines/></ProtectedRoute> },
    { path: "/fhirdetails", component: <ProtectedRoute><Fhirdetails/></ProtectedRoute> },
    { path: "/MedicalRackApp", component: <ProtectedRoute><MedicalRackApp/></ProtectedRoute> },
    { path: "/paymentconfirmation", component: <ProtectedRoute><BillPage/></ProtectedRoute> },
    { path: "/appointments/new", component: <ProtectedRoute><Appointment/></ProtectedRoute> },
    { path: "/appointment", component: <Navigate to="/appointments/new"/> },
    { path: "/fillDetails",component: <ProtectedRoute><PatientInfoCategories /> </ProtectedRoute>},
    { path: "/unauthorized", component: <UnauthorizedModal/>},
    { path: "/status-failed", component: <StatusFail/> },
    { path: "*", component: <NotFound/>},
    
]
 

export default routes;
