import { Cookie } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
const HospitalModal = ({
  selectedTenant,
  handleHospitalChange,
  setSelectedTenant,
}) => {
  const [isHospitalOpen, setHospitalOpen] = useState(false);
  const [mergedTenants, setMergedTenants] = useState([]);

  const toggleDropdown = () => {
    setHospitalOpen(!isHospitalOpen);
  };

  const admin_profile = JSON.parse(localStorage.getItem("admin_profile"));
  const { profileData } = useSelector((state) => state.profile);
  useEffect(() => {
    if (profileData && admin_profile && Array.isArray(admin_profile.tenants)) {
      const merged = admin_profile.tenants.reduce((acc, curr) => {
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
      const tenantId = Cookies.get("TenantId");
      const findTeannt = merged.find((elm) => elm.tenantId == tenantId);
      setSelectedTenant(findTeannt);

      setMergedTenants(merged);
    }
  }, [profileData]);

  return (
    <div className="relative">
      <div className="text-black cursor-pointer" onClick={toggleDropdown}>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-700 text-md mr-3">
              {selectedTenant?.tenantName}
            </h1>
          </div>
          <IoIosArrowDown
            className={`text-[1.15rem] transition-transform duration-500 ${
              isHospitalOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isHospitalOpen && (
          <div className="absolute top-full left-0 w-max bg-white border border-gray-300 rounded-md mt-1 z-10">
            {mergedTenants.length > 0 ? (
              mergedTenants.map(
                (tenant, index) =>
                  selectedTenant.tenantId !== tenant.tenantId && (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleHospitalChange(tenant)}
                    >
                      {tenant.tenantName}
                    </div>
                  )
              )
            ) : (
              <div className="p-2 text-gray-500">No More tenants available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalModal;
