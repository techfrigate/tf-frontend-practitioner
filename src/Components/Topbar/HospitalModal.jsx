import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateLastApp } from "../../Store/profileSlice";
import toast from "react-hot-toast";
import HospitalDropDown from "./HospitalDropDown";
import TenantAppsModal from "./TenantAppsModal";

const HospitalModal = ({ selectedTenant, setSelectedTenant }) => {
  const [mergedTenants, setMergedTenants] = useState([]);
  const [nonCentralTenant, setNonCentralTenant] = useState(null);

  const { profileData } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const tenantId = Cookies.get("TenantId");
  const userId = Cookies.get("UserId");
  const token = Cookies.get("Token");

  const fetchAndSetMergedTenants = useCallback(() => {
    if (profileData?.tenants?.length) {
      const merged = profileData.tenants.reduce((acc, curr) => {
        const existingTenant = acc.find(
          (tenant) => tenant.tenantId === curr.tenantId
        );
        if (existingTenant) {
          if (!existingTenant.userType.includes(curr.userType)) {
            existingTenant.userType.push(curr.userType);
          }
        } else {
          acc.push({
            _id: curr._id,
            tenantId: curr.tenantId,
            tenantName: curr.tenantName,
            userType: [curr.userType],
          });
        }
        return acc;
      }, []);

      setSelectedTenant(
        merged.find((elm) => elm.tenantId === tenantId) || merged[0]
      );
      setMergedTenants(merged);
    }
  }, [profileData, setSelectedTenant, tenantId]);

  useEffect(() => {
    fetchAndSetMergedTenants();
  }, [fetchAndSetMergedTenants]);

  const handleHospitalChange = async (tenant) => {
    if (tenant.userType.includes("Practitioner")) {
      try {
        const response = await dispatch(
          updateLastApp({ userId, body: { tenantId: tenant.tenantId } })
        );
        if (response?.status === 200) {
          setSelectedTenant(tenant);
          Cookies.set("TenantId", tenant.tenantId);
          window.location.reload();
        } else {
          toast.error(
            response?.data?.message || "An unexpected error occurred."
          );
        }
      } catch {
        toast.error("Failed to update the last accessed application.");
      }
    } else {
      setNonCentralTenant(tenant);
    }
  };

  const handleNonpatientUserTypeSelect = async (userType) => {
    try {
      const response = await dispatch(
        updateLastApp({
          userId,
          body: { tenantId: nonCentralTenant.tenantId, appName: userType },
        })
      );

      if (response?.status === 200) {
        const baseUrl = "http://localhost";
        const portMap = {
          patient: 3006,
          central_admin: 3003,
          practitioner: 3005,
        };
        const url = portMap[userType]
          ? `${baseUrl}:${portMap[userType]}?vt=${token}&ui=${userId}&ti=${nonCentralTenant.tenantId}`
          : `${baseUrl}:3002`;

        window.location.href = url;
      } else {
        toast.error(response?.data?.message || "An unexpected error occurred.");
        setNonCentralTenant(null);
      }
    } catch {
      toast.error("Failed to update the last accessed application.");
      setNonCentralTenant(null);
    }
  };

  return (
    <div className="relative">
      <HospitalDropDown
        selectedTenant={selectedTenant}
        tenants={mergedTenants}
        onSelect={handleHospitalChange}
      />
      {nonCentralTenant && (
        <TenantAppsModal
          tenant={nonCentralTenant}
          onClose={() => setNonCentralTenant(null)}
          onSelectApp={handleNonpatientUserTypeSelect}
        />
      )}
    </div>
  );
};

export default HospitalModal;
