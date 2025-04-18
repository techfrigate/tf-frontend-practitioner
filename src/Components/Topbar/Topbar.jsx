import React, { useState, useEffect, useRef } from "react";
import { AiOutlineBell, AiOutlineQuestionCircle } from "react-icons/ai";
import styles from "../../Css/Topbar/Topbar.module.css";
import ProfileModal from "./ProfileModal";
import HelpModal from "./HelpModal";
import NotificationModal from "./NotificationModal";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CreateNewModal from "./CreateNewModal";
import HospitalModal from "./HospitalModal";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const Topbar = ({ toggleCreateProviderForm, showForm,onMenuClick }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const { pathname } = useLocation();
  const profileModalRef = useRef(null);
  const createNewModalRef = useRef(null);
  const thanosRef = useRef();

  const navigate =useNavigate()
  const{profileData} = useSelector((state) => state.profile);
  const [selectedTenant, setSelectedTenant] = useState();

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

  const handleAddBillClick = () => {
    navigate("/add-bill");
    toggleCreateProviderForm();
  };

  const handleModalClick = () => {
    Swal.fire({
      title: 'Select Option',
      html: `
        <div class="flex flex-col gap-4">
          <button id="addMedicine" class="px-4 py-2 bg-[#64C6B0] text-white rounded hover:bg-[#4fa693]">
            Add Medicine
          </button>
          <button id="medicalRack" class="px-4 py-2 bg-[#64C6B0] text-white rounded hover:bg-[#4fa693]">
            Medical Rack App
          </button>
        </div>`,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'custom-popup-class',
      },
      didOpen: () => {
        document.getElementById('addMedicine').addEventListener('click', () => {
          Swal.close();
          navigate("/add-medicine");
          toggleCreateProviderForm();
        });

        document.getElementById('medicalRack').addEventListener('click', () => {
          Swal.close();
          navigate("/MedicalRackApp");
        });
      }
    });
  };


  const handleHospitalChange = (tenant) => {
    Cookies.set("TenantId", tenant.tenantId);
    setSelectedTenant(tenant);

    window.location.replace(window.location.href);
  };

  return (
    <div className="w-full p-2  ">
      <div className="bg-white rounded-md lg:pl-10 pl-6 pr-10 py-2 flex justify-between items-center">      
      <div className="flex items-center gap-4 justify-center">
      <button onClick={onMenuClick} className="lg:hidden">
            <HiOutlineMenuAlt2 size={25} />
          </button>
        <div className="flex flex-col justify-center items-start ">
          <HospitalModal
            selectedTenant={selectedTenant}
            handleHospitalChange={handleHospitalChange}
            setSelectedTenant={setSelectedTenant}
          />
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
      </div>
        <div className="flex gap-10 justify-between  items-center ">
          <div className="flex items-center gap-6 text-[#64C6B0] relative">
            <div>{ window.location.href.includes("billing") &&!showForm && (
            <CustomButton
              text= "+ Add Bill" 
              onclick={handleAddBillClick}/>
          )}
           </div>
            <div>{window.location.href.includes("medicines") && !showForm  && (
            <CustomButton
              text= "+ Medicines" 
              onclick={handleModalClick}/>
          )}
           </div>
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
                src={profileData?.imageUrl || null}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-[#64C6B0] shadow-lg"
                onClick={handleProfileClick}
              />
              {isProfileModalOpen && <ProfileModal />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
