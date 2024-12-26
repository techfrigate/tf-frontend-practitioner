import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import { Suspense, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./Store/profileSlice";
import routes from "./routes/routes";
import Sidebar from "./Components/Sidebar/Sidebar";
import Topbar from "./Components/Topbar/Topbar";
function App() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggleCreateProviderForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location =  useLocation()
  const accessToken = searchParams.get("vt") ||  Cookies.get("Token");
  const userId = searchParams.get("ui") ||  Cookies.get("UserId");
  const tenantId = searchParams.get("ti") ||  Cookies.get("TenantId");
 const {profileData}  =  useSelector((state)=>state.profile)
//  console.log(userId,"userId")
  useEffect(() => {
    if (userId && accessToken && tenantId && !profileData) {
      dispatch(fetchUserProfile({ userId, accessToken, tenantId }));
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [userId, accessToken, tenantId, dispatch]);


  useEffect(()=>{
    const ports = {
      '/': 'Home - Practitoner',
      '/worklist': 'Work List - Practitoner',
      '/patients': 'Patients - Practitoner',
      '/calendar': 'Calendar - Practitoner',
      '/billing': 'Billing - Practitoner',
      '/newPatients': 'Create New Patients - Practitoner',
      '/appointment': 'Appointment - Practitoner',
      '/payment': 'Payment - Practitoner',
      '/fillDetails': 'Patient Info Categories - Practitoner',
      '/unauthorized': 'Unauthorized - Practitoner',
      '*': 'Not Found - Practitoner',
    };
    
    
    const currentTitle =  ports[location.pathname] || 'Practitioner App'
    document.title = currentTitle
  },[location])
  

 
  return loading  && !profileData ? (
    <div>Loading...</div>  
  ) :(
    <div className="flex  bg-gray-200 h-[100vh] ">
      <Sidebar />
      <div className="flex flex-col w-full h-[100vh] box-border overflow-hidden ">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm} />
        <div className="px-2 pb-3 h-full w-full  overflow-y-hidden">
          <div className={`w-full h-full  rounded-md bg-white`}>
 
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
              {
                routes.map((route,index)=>(
                  <Route key={index} path={route.path} element={route.component} />
                ))
              }
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
