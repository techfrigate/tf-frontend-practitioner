import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import CustomButton from "../Common/CustomButton";

const EditProfileModal = ({
  isOpen,
  onClose,
  profileImageUrl,
  updateProfileImage,
  setIsOpen,
}) => {
  const [imageUrl, setImageUrl] = useState(profileImageUrl);
  const [newImageFile, setNewImageFile] = useState(null);

  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (newImageFile) {
      const newImageUrl = imageUrl;
      updateProfileImage(newImageUrl);
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

        <div className="inline-block align-bottom bg-white shadow-lg pb-10 pl-4 pt-2 text-left rounded-xl transform transition-all sm:my-8 sm:align-middle w-[100%] max-w-[36rem]">
          <div className="relative bg-white rounded-xl" ref={modalRef}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-2xl text-gray-600 font-semibold rounded px-3 py-2"
            >
              <AiOutlineClose />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Profile Image</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full"
              />
            )}
            <div className="mt-4 px-4 py-2 flex justify-end gap-3">
              <CustomButton onclick={handleSave} text={"Save"} />
              <CustomButton onclick={onClose} text={"Cancel"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
