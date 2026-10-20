import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Logo and display name of the hospital the admin is signed in to.
export const useTenantBranding = () => {
  const tenantId = Cookies.get("TenantId");
  const [branding, setBranding] = useState({ image: "", name: "" });

  useEffect(() => {
    if (!tenantId) return;
    axios
      .get(`${process.env.REACT_APP_ACCOUNTS_URL}/tenants/tenant/${tenantId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
      })
      .then((res) => {
        const info = res.data?.data?.businessInformation;
        if (info) setBranding({ image: info.displayImage || "", name: info.displayName || info.legalName || "" });
      })
      .catch(() => {});
  }, [tenantId]);

  return branding;
};
