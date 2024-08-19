import { Route, Routes, useSearchParams } from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Topbar from "./Components/Topbar/Topbar";
import Patients from "./Pages/Patients/Patients";
import { useEffect, useState } from "react";
import WorkList from "./Pages/WorkList/WorkList";
import Calendar from "./Pages/Calendar/Calendar";
import Billing from "./Pages/Billing/Billing";
import CreateNewPatients from "./Components/Topbar/CreateNewPatients/CreateNewPatients";
import Appointment from "./Components/Topbar/Appointment/Appointment";
import Payment from "./Components/Payment/Payment";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./Store/profileSlice";

function App() {
  const [showForm, setShowForm] = useState(false);

  const toggleCreateProviderForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };


  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const accessToken = searchParams.get("vt") || Cookies.get("Token");
  const userId = searchParams.get("ui") || Cookies.get("UserId");
  const tenantId = searchParams.get("ti") || Cookies.get("TenantId");

  useEffect(() => {
    if (userId && accessToken && tenantId) {
      dispatch(fetchUserProfile({ userId, accessToken, tenantId }));
    }
  }, [userId, accessToken, tenantId, dispatch]);

  return (
    <div className="flex  bg-gray-200 h-[100vh] ">
      <Sidebar />
      <div className=" flex flex-col w-full max-h-[100vh] box-border overflow-hidden ">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm} />
        <div className="px-2 pb-2 h-[100%] w-full">
          <div className={`w-full h-[100%] rounded-md bg-white`}>
            <Routes>
              <Route path="/" element={<WorkList />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/calendar" element={<Calendar />} />
              {/* <Route path="/workitem" element={<WorkList2 />} /> */}
              <Route path="/billing" element={<Billing />} />
              <Route path="/newPatients" element={<CreateNewPatients />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
