import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";


import { fetchUserProfile } from "./Store/profileSlice";
import routes from "./routes/routes";
import Sidebar from "./Components/Sidebar/Sidebar";
import Topbar from "./Components/Topbar/Topbar";
import "./App.css";
import Loader from "./Components/Common/Loader";


function handleDocumentTitle(location) {
  const ports = {
    '/': 'Home - Practitoner',
    '/worklist': 'Work List - Practitoner',
    '/ward': 'Ward - Practitoner',
    '/patients': 'Patients - Practitoner',
    '/calendar': 'Calendar - Practitoner',
    '/billing': 'Billing - Practitoner',
    '/new-patient': 'Create New Patients - Practitoner',
    '/appointment': 'Appointment - Practitoner',
    '/payment': 'Payment - Practitoner',
    '/fillDetails': 'Patient Info Categories - Practitoner',
    '/unauthorized': 'Unauthorized - Practitoner',
    '*': 'Not Found - Practitoner',
  };
  
  
  const currentTitle =  ports[location.pathname] || 'Practitioner App'
  document.title = currentTitle
}


function App() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location =  useLocation()

  const accessToken = searchParams.get("vt") ||  Cookies.get("Token");
  const userId = searchParams.get("ui") ||  Cookies.get("UserId");
  const tenantId = searchParams.get("ti") ||  Cookies.get("TenantId");

 const {profileData}  =  useSelector((state)=>state.profile)
 const navigate = useNavigate();
  useEffect(() => {
    if (userId && accessToken && tenantId && !profileData) {
      dispatch(fetchUserProfile({ userId, accessToken, tenantId, navigate}));
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [userId, accessToken, tenantId, dispatch]);


  useEffect(()=>{
   handleDocumentTitle(location)
  },[location])

  
  useEffect(() => {
    const handleRouteChange = () => {
      navigate(window.location.pathname);  
    };

    window.addEventListener("customRouteChange", handleRouteChange);

    return () => {
      window.removeEventListener("customRouteChange", handleRouteChange);
    };
  }, [navigate]);
  
  const toggleCreateProviderForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };
 
  if(loading && !profileData){
    return   <div className="w-full h-[100vh]"> <Loader/> </div>
  }


  return (
    <div className="flex bg-gray-200 h-[100vh] ">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
      <div className="flex flex-col w-full h-[100vh] box-border overflow-hidden">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm}  onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <div className="px-2 pb-3 h-full w-full overflow-y-hidden">
          <div className={`w-full h-full customScrollbar rounded-md bg-white`}>
            <Suspense fallback={<Loader/>}>
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
