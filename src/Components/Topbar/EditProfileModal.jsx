import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import CustomButton from "../Common/CustomButton";
import CustomImageInput from "../Common/CustomImageInput";
import { getImageUrl } from "../../util/fileUploader";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { patchPatientById } from "../../Store/patientSlice";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({
  isOpen,
  onClose,
  profileImageUrl,
  patientId,
  patient,
  setIsOpen,
}) => {
  const [imageUrl, setImageUrl] = useState(profileImageUrl);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleImageChange = async (e) => {
    try {
      setIsLoading(true);
      const url = await getImageUrl(e);
      setImageUrl(url);
      setIsInvalid(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) {
      setIsInvalid(true);
      return;
    }
  
    try {
      setIsLoading(true);
            const updatePayload = {
        id: patientId,         
        userId: patient.userId, 
        updates: {
          imageUrl
        }
      };
  
      console.log('Sending update payload:', updatePayload);
  
      const result = await dispatch(patchPatientById(updatePayload)).unwrap();
      
      if (result) {
        toast.success("Profile image updated successfully");
        onClose();
        navigate("/patients");
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error?.message || "Failed to update profile image");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1.5px]"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white shadow-lg p-6 text-left rounded-xl transform transition-all sm:my-8 sm:align-middle w-[100%] max-w-[36rem]">
          <div className="relative bg-white rounded-xl" ref={modalRef}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-2xl text-gray-600 font-semibold rounded px-3 py-2"
            >
              <AiOutlineClose />
            </button>
            <h2 className="text-lg font-semibold mb-6">Edit Profile Image</h2>
            <CustomImageInput
              id="profile-image"
              label="Profile Picture"
              isInvalid={isInvalid}
              onchange={handleImageChange}
              imageUrl={imageUrl}
            />
            <div className="mt-6 flex justify-end gap-3">
              <CustomButton 
                onclick={handleSave} 
                text={isLoading ? "Saving..." : "Save"}
                disabled={isLoading}
              />
              <CustomButton 
                onclick={onClose} 
                text="Cancel" 
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;