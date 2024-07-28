import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Topbar from "./Components/Topbar/Topbar";
import Patients from "./Pages/Patients/Patients";
import { useState } from "react";
import WorkList from "./Pages/WorkList/WorkList";
import Calendar from "./Pages/Calendar/Calendar";
import Billing from "./Pages/Billing/Billing";
import CreateNewPatients from "./Components/Topbar/CreateNewPatients/CreateNewPatients";
import Appointment from "./Components/Topbar/Appointment/Appointment";
import Payment from "./Components/Payment/Payment";

function App() {
  // eslint-disable-next-line
  const [showForm, setShowForm] = useState(false);

  const toggleCreateProviderForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };
  return (
    <div className="flex  bg-gray-200 h-[100vh] ">
      <Sidebar />
      <div className=" flex flex-col w-full h-[100vh] box-border overflow-hidden ">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm} />
        <div className="px-2 pb-3 w-full">
          <div className={`w-full h-[83.7vh]  rounded-md bg-white`}>
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
