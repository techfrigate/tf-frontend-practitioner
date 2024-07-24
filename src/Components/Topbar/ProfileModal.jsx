import React, { useEffect, useRef } from 'react';
import CustomButton from '../Common/CustomButton';

const ProfileModal = ({ onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className="absolute z-20 top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-5 px-7 w-80">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8">
          <img
            src="https://t4.ftcdn.net/jpg/03/24/22/77/360_F_324227760_73JhXgDh5OFsYuymiMzn6s7FHHzf3Ef0.jpg"
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-2 border-[#64C6B0] shadow-lg"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-base font-semibold">Unifycare Admin</h2>
          <p className="text-gray-600 text-sm">systems@unify.digital</p>
        </div>
      </div>
      <CustomButton text="Sign out" width="w-full" />
    </div>
  );
};

export default ProfileModal;
