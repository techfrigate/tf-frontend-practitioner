import React, { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import CustomButton from "../Common/CustomButton";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./ConfirmationModal";
import Cookies from "js-cookie";
const PROVIDER_APP = process.env.REACT_APP_PROVIDER_URL;
const PATIENT_APP = process.env.REACT_APP_PATIENT_URL;
const PRACTITIONER_APP = process.env.REACT_APP_PRACTITIONER_URL;
const CENTRAL_ADMIN_APP = process.env.REACT_APP_CENTRAL_ADMIN_URL;
const SIGNUP_APP = process.env.REACT_APP_SIGNIN_URL;
const ProfileModal = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://t4.ftcdn.net/jpg/03/24/22/77/360_F_324227760_73JhXgDh5OFsYuymiMzn6s7FHHzf3Ef0.jpg"
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("practitioner");
  const openEditModal = () => {
    setIsEditOpen(true);
  };
  const SignIn_URL = process.env.REACT_APP_SIGNIN_URL;

  console.log(SignIn_URL);

  const handleSignOut = () => {
    setIsConfirmOpen(true);
  };

  const confirmSignOut = () => {
    Cookies.remove("tenant");
    Cookies.remove("tenantId");
    Cookies.remove("Token");

    localStorage.clear();

    window.location.href = SIGNUP_APP;
  };

  const cancelSignOut = () => {
    setIsConfirmOpen(false);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const updateProfileImage = (newImageUrl) => {
    setProfileImageUrl(newImageUrl);
    closeEditModal();
  };

  const toggleUserTypeDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const tenantId = Cookies.get("TenantId");

  const profile = JSON.parse(localStorage.getItem("admin_profile"));

  // console.log(profile);

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
  }, []);

  useEffect(() => {
    const findTenant = profile.tenants.find((elm) => elm.tenantId === tenantId);
    if (!findTenant) {
      localStorage.clear();
      return (window.location.href = SIGNUP_APP);
    }
    const { userTypes } = findTenant;
    setUserTypes(() => userTypes);
  }, []);

  const handleUserTypeChange = (type) => {
    setSelectedUserType(type);
    console.log(`User type for tenant ${tenantId} changed to ${type}`);
    const token = Cookies.get("Token");
    const { userId } = profile;

    setIsDropdownOpen(false);
    const ports = {
      central_admin: CENTRAL_ADMIN_APP,
      practitioner: PRACTITIONER_APP,
      patient: PATIENT_APP,
      provider: PROVIDER_APP,
    };

    const port = ports[type];
    const url = port
      ? `${port}?vt=${token}&ui=${userId}&ti=${tenantId}`
      : `${SIGNUP_APP}`;

    window.location.href = url;
  };

  return (
    <>
      {isEditOpen ? null : (
        <div className="absolute z-20 top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-5 px-7 w-80">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 relative">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-[#64C6B0] shadow-lg"
              />
              <button
                onClick={openEditModal}
                className="absolute -bottom-1 -right-1.5 bg-[#64C6B0] rounded-full p-1 border border-gray-200"
              >
                <MdOutlineEdit className="text-white" size={14} />
              </button>
            </div>
            <div className="ml-4">
              <h2 className="text-base font-semibold">
                {firstName} {lastName}
              </h2>
              <p className="text-gray-600 text-sm">{email}</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="w-[37%]">
              <CustomButton
                width={"w-full"}
                text="Sign out"
                onclick={handleSignOut}
              />
            </div>
          </div>

          <div className="mt-4"></div>
        </div>
      )}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        onClose={closeEditModal}
        profileImageUrl={profileImageUrl}
        updateProfileImage={updateProfileImage}
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
