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


// Reads the role and user from the stored login token (display only; the backend verifies the signature).
const tokenClaims = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

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

  const session = tokenClaims(Cookies.get("Token"));
  if (profileData && session && (session.userType !== "practitioner" || session.sub !== profileData.userId)) {
    return (
      <div className="flex h-[100vh] items-center justify-center bg-canvas p-6">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-lg font-semibold text-slate-900">You're signed in to another portal</h1>
          <p className="mt-2 text-sm text-slate-600">
            This browser's current session belongs to a {session.userType ? session.userType.replace("_", " ") : "different"} account, so the
            practitioner workspace can't load Dr. {profileData.firstName}'s data. Sign in again to continue.
          </p>
          <a
            href={process.env.REACT_APP_SIGNIN_URL}
            className="mt-6 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Sign in again
          </a>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-[100vh] bg-canvas text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex h-[100vh] min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="customScrollbar flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            className={
              location.pathname === "/dashboard"
                ? "relative mx-auto w-full max-w-[1400px]"
                : "relative mx-auto h-full min-h-[calc(100vh-7rem)] w-full max-w-[1400px] overflow-auto rounded-xl border border-slate-200 bg-white shadow-card"
            }
          >
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
        </main>
      </div>
    </div>
  );
}

export default App;
