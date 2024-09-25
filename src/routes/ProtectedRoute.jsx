import Cookies from "js-cookie"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const accessToken = Cookies.get("Token");
    const userId = Cookies.get("UserId");
    const tenantId = Cookies.get("TenantId");
  
    if (!accessToken || !userId || !tenantId) {
      return <Navigate to="/unauthorized" />;
    }
    
    return children;
  };
  export default ProtectedRoute