import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Topbar from "./Components/Topbar/Topbar";

import { Suspense, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./Store/profileSlice";
import routes from "./routes/routes";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);  
  const toggleCreateProviderForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };


  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const accessToken = searchParams.get("vt") ||  Cookies.get("Token");
  const userId = searchParams.get("ui") ||  Cookies.get("UserId");
  const tenantId = searchParams.get("ti") ||  Cookies.get("TenantId");
 const {profileData}  =  useSelector((state)=>state.profile)
  useEffect(() => {
    if (userId && accessToken && tenantId && !profileData) {
      dispatch(fetchUserProfile({ userId, accessToken, tenantId }));
    }

    setTimeout(() => {
      setLoading(false);  
    }, 500); 
  }, [userId, accessToken, tenantId, dispatch]);

  return loading  && !profileData ? (
    <div>Loading...</div>  
  ) :(
    <div className="flex  bg-gray-200 h-[100vh] ">
      <Sidebar />
      <div className=" flex flex-col w-full max-h-[100vh] box-border overflow-hidden ">
        <Topbar toggleCreateProviderForm={toggleCreateProviderForm} />
        <div className="px-2 pb-2 h-[100%] w-full">
          <div className={`w-full h-[100%] rounded-md bg-white`}>
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
