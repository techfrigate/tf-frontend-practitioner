import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import CustomButton from "../Common/CustomButton";
import EditProfileModal from "./EditProfileModal";

const ProfileModal = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://t4.ftcdn.net/jpg/03/24/22/77/360_F_324227760_73JhXgDh5OFsYuymiMzn6s7FHHzf3Ef0.jpg"
  );

  const openEditModal = () => {
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const updateProfileImage = (newImageUrl) => {
    setProfileImageUrl(newImageUrl);
    closeEditModal();
  };

  return (
    <>
      {isEditOpen ? null : (
        <div className="absolute z-20 top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-5 px-7 w-80">
          <div className="flex items-center mb-6 ">
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
              <h2 className="text-base font-semibold">Unifycare Admin</h2>
              <p className="text-gray-600 text-sm">systems@unify.digital</p>
            </div>
          </div>
          <CustomButton text="Sign out" width="w-full" />
        </div>
      )}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        onClose={closeEditModal}
        profileImageUrl={profileImageUrl}
        updateProfileImage={updateProfileImage}
      />
    </>
  );
};

export default ProfileModal;
