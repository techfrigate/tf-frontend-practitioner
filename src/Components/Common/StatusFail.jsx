import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { use } from "react";

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;

const StatusFail = () => {
  const dispatch = useDispatch();
  const { tenantObjects} = useSelector((state) => state.statusFail);

 console.log(tenantObjects,"tenantObjects")

  async function onSelectTenant(tenant) {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/auth/status-token`, {
        headers: {
          "Content-Type": "application/json",
          userId: Cookies.get("UserId"),
          tenantId: tenant.tenantId,
          userType: tenant.userType,
        },
      });
      const { access_token } = response.data;
      await updateLastApp(
        Cookies.get("UserId"),
        tenant.tenantId,
        access_token,
        tenant.userType
      );
    } catch (error) {
       
      toast.error("Something went wrong please try again");
    }
  }

  async function updateLastApp(userId, tenantId, access_token, userType) {
    const urlObjects = {
      provider: process.env.REACT_APP_PROVIDER_URL,
      patient: process.env.REACT_APP_PATIENT_URL,
      admin: process.env.REACT_APP_ADMIN_URL,
    };
    try {
      await axios.patch(`${ACCOUNTS_URL}/lastapp/${userId}`, {
        tenantId: tenantId,
        appName: userType,
      });

      window.location.href = `${urlObjects[userType]}/?ti=${tenantId}&vt=${access_token}&ui=${userId}`;
    } catch (error) {
      toast.error("Something went wrong please try again");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl">
        {/* Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Access denied: Your profile is not active in this organization.
          </h2>
          <p className="text-gray-600 mt-2">
            It looks like your profile has been deactivated for this
            organization. Please choose an available option below.
          </p>
        </div>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tenantObjects?.length > 0 ? (
            tenantObjects.map(
              (tenant) =>
                tenant.status && (
                  <div
                    key={tenant.tenantId}
                    onClick={() => onSelectTenant(tenant)}
                    className="p-6 text-center bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#64c6b0]"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {tenant.tenantName}
                    </h3>
                    <p className="text-gray-600  ">{tenant.userType}</p>
                  </div>
                )
            )
          ) : (
            <p className="text-gray-600 col-span-3 text-center">
              We couldn’t find an active profile for you. Please check with your
              organization administrator.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusFail;
