import React, { useState, useEffect, useRef } from "react";
import { AiOutlineBell, AiOutlineQuestionCircle } from "react-icons/ai";
import styles from "../../Css/Topbar/Topbar.module.css";
import ProfileModal from "./ProfileModal";
import HelpModal from "./HelpModal";
import NotificationModal from "./NotificationModal";
import { useLocation } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CreateNewModal from "./CreateNewModal";

const Topbar = ({ toggleCreateProviderForm, showForm }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const { pathname } = useLocation();
  const profileModalRef = useRef(null);
  const createNewModalRef = useRef(null);
  const thanosRef = useRef();

  const pathSegments = [
    "Practitioner",
    ...pathname.split("/").filter((x) => x),
  ];

  const handleClickOutside = (event) => {
    if (thanosRef.current && !thanosRef.current.contains(event.target)) {
      setIsNotificationModalOpen(false);
      setIsHelpModalOpen(false);
      setIsProfileModalOpen(false);
    }
  };

  useEffect(() => {
    if (isNotificationModalOpen || isHelpModalOpen || isProfileModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleProfileClick = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    setIsHelpModalOpen(false);
    setIsNotificationModalOpen(false);
    setIsCreateNewModalOpen(false);
  };

  const handleHelpClick = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
    setIsProfileModalOpen(false);
    setIsNotificationModalOpen(false);
    setIsCreateNewModalOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
    setIsProfileModalOpen(false);
    setIsHelpModalOpen(false);
    setIsCreateNewModalOpen(false);
  };

  const handleCreateNewClick = () => {
    setIsCreateNewModalOpen(!isCreateNewModalOpen);
    setIsHelpModalOpen(false);
    setIsNotificationModalOpen(false);
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target)
      ) {
        setIsProfileModalOpen(false);
      }
      if (
        createNewModalRef.current &&
        !createNewModalRef.current.contains(event.target)
      ) {
        setIsCreateNewModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full p-2 max-h-max">
      <div className="bg-white rounded-md px-10 py-2 flex justify-between items-center">
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold mb-1 text-gray-800">Hospital</h1>

          <p className="breadcrumb">
            {pathSegments.map((segment, index) => (
              <span key={index}>
                {index > 0 && (
                  <span className="breadcrumb-separator">{" | "}</span>
                )}
                <span className="capitalize">{segment}</span>
              </span>
            ))}
          </p>
        </div>

        <div className="flex gap-10 justify-between  items-center ">
          <div className="flex items-center gap-6 text-[#64C6B0] relative">
            <div className="relative cursor-pointer" ref={createNewModalRef}>
              <CustomButton text="+ New" onclick={handleCreateNewClick} />
              {isCreateNewModalOpen && (
                <CreateNewModal
                  onClose={() => setIsCreateNewModalOpen(false)}
                />
              )}
            </div>
            <div className="relative cursor-pointer" ref={thanosRef}>
              <AiOutlineQuestionCircle size={25} onClick={handleHelpClick} />
              {isHelpModalOpen && <HelpModal />}
            </div>
            <div
              className="relative cursor-pointer"
              onClick={handleNotificationClick}
            >
              <AiOutlineBell size={25} />
              <div className={`${styles.wave_dot_container}`}>
                <span className={`${styles.wave_dot}`}></span>
                <span className={`${styles.wave_animation}`}></span>
              </div>
              {isNotificationModalOpen && <NotificationModal />}
            </div>
            <div className="relative w-8 h-8 cursor-pointer" ref={thanosRef}>
              <img
                src="https://t4.ftcdn.net/jpg/03/24/22/77/360_F_324227760_73JhXgDh5OFsYuymiMzn6s7FHHzf3Ef0.jpg"
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-[#64C6B0] shadow-lg"
                onClick={handleProfileClick}
              />
              {isProfileModalOpen && (
                <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
