import React from "react";
import { useDispatch } from "react-redux";
import ProfilePhotoModal from "../Common/ProfilePhotoModal";
import { updateUserProfileImage } from "../../Store/profileSlice";

const EditProfileModal = ({ isOpen, onClose, profileImageUrl }) => {
  const dispatch = useDispatch();
  return <ProfilePhotoModal isOpen={isOpen} onClose={onClose} currentUrl={profileImageUrl} onUpdated={(url) => dispatch(updateUserProfileImage(url))} />;
};

export default EditProfileModal;
