 
import React, { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import CustomButton from "../Common/CustomButton";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./ConfirmationModal";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const PROVIDER_APP = process.env.REACT_APP_PROVIDER_URL;
const PATIENT_APP = process.env.REACT_APP_PATIENT_URL;
const PRACTITIONER_APP = process.env.REACT_APP_PRACTITIONER_URL;
const CENTRAL_ADMIN_APP = process.env.REACT_APP_CENTRAL_ADMIN_URL;
const SIGNUP_APP = process.env.REACT_APP_SIGNIN_URL;
const SIGNIN_URL = process.env.REACT_APP_SIGNIN_URL;


const formatStateWord = (stateWord) => {
  return stateWord
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ProfileModal = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://t4.ftcdn.net/jpg/03/24/22/77/360_F_324227760_73JhXgDh5OFsYuymiMzn6s7FHHzf3Ef0.jpg"
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {profileData}  =  useSelector((state)=>state.profile)

  const [userTypes, setUserTypes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  const [selectedUserType, setSelectedUserType] = useState("practitioner");
  const [profile, setProfile] = useState(null);

useEffect(() => {
  if (profileData) {
    setProfile(profileData);
    setProfileImageUrl(profileData.imageUrl);
    const tenantId = Cookies.get("TenantId");
    if (profileData?.tenants) {
      const findTenant = profileData.tenants.find(
        (elm) => elm.tenantId === tenantId
      );
      if (!findTenant) {
        window.location.href = SIGNIN_URL;
        return;
      }
      setUserTypes(findTenant.userTypes || []);
    }
  }
}, [profileData]);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);
  const handleSignOut = () => setIsConfirmOpen(true);

  const confirmSignOut = () => {
    Cookies.remove("tenant");
    Cookies.remove("tenantId");
    Cookies.remove("Token");
    localStorage.clear();
    window.location.href = SIGNIN_URL;
  };
  console.log(profile)

  const cancelSignOut = () => setIsConfirmOpen(false);

// eslint-disable-next-line
  const toggleUserTypeDropdown = () => setIsDropdownOpen(!isDropdownOpen);
// eslint-disable-next-line
  const handleUserTypeChange = (type) => {
    setSelectedUserType(type);
    const tenantId = Cookies.get("TenantId");
    const token = Cookies.get("Token");
    const userId = profile?.userId;

    setIsDropdownOpen(false);

    const ports = {
      central_admin: CENTRAL_ADMIN_APP,
      practitioner: PRACTITIONER_APP,
      patient: PATIENT_APP,
      provider: PROVIDER_APP
    };

    const port = ports[type];
    const url = port
      ? `${port}?vt=${token}&ui=${userId}&ti=${tenantId}`
      : `${SIGNUP_APP}`;

    window.location.href = url;
  };

  if (!profile) {
    return null; 
  }

  const { firstName = "", lastName = "", email = "" } = profile;
 
  const mergedTenants = profile?.tenants?.reduce((acc, curr) => {
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
  }, []) || [];

  return (
    <>
      {isEditOpen ? null : (
        <div className="absolute z-20 top-12 right-0 bg-white rounded-xl shadow-2xl w-80 overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#64C6B0]/10 to-[#64C6B0]/5 p-6">
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#64C6B0]/20 shadow-md"
              />
              <button
                onClick={() => setIsEditOpen(true)}
                className="absolute -bottom-1 -right-1 bg-[#64C6B0] rounded-full p-1.5 shadow-lg hover:bg-[#58b19e] transition-colors"
              >
                <MdOutlineEdit className="text-white w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-500 truncate">{email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-[#64C6B0]/10 text-[#64C6B0]">
                {formatStateWord(selectedUserType)}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Actions Section */}
        <div className="p-4 space-y-3">
          {/* Role Switcher */}
          {/* <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#64C6B0] focus:ring-offset-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>Switch Role</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

          
            {isDropdownOpen && (
              <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {profile?.tenants?.map((tenant) => (
                  tenant.userType !=='central_admin' &&
                  <button
                    key={tenant.tenantId}
                    onClick={() => handleUserTypeChange(tenant.userType)}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg focus:outline-none focus:bg-gray-50 transition-colors"
                  >
                    {tenant.userType.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                     tenant.userType.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      )}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        onClose={closeEditModal}
        profileImageUrl={profile.imageUrl}
        patientId={profile._id}
        patient={{              
          _id: profile._id,
          userId: profile.userId
        }}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />
    </>
  );
};

export default ProfileModal;