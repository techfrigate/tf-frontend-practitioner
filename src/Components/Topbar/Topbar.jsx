import React, { useState, useEffect, useRef } from "react";
import { Bell, CircleHelp, Menu, Plus } from "lucide-react";
import ProfileModal from "./ProfileModal";
import HelpModal from "./HelpModal";
import NotificationModal from "./NotificationModal";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CreateNewModal from "./CreateNewModal";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";

const PAGE_TITLES = {
  "/appointments": "Appointments",
  "/appointments/new": "New appointment",
  "/worklist": "Teleconsult worklist",
  "/calendar": "Calendar",
  "/patients": "Patients",
  "/new-patient": "Register patient",
  "/ward": "Ward",
  "/ipd": "Bed board",
  "/prescriptions": "Prescriptions",
  "/prescriptions/write": "Write prescription",
  "/ipd/admit": "Admit patient",
  "/ipd/admissions": "Admissions",
  "/medicines": "Medicines",
  "/MedicalRackApp": "Medical racks",
  "/add-medicine": "Add medicine",
  "/billing": "Billing",
  "/add-bill": "New bill",
};

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

  // Readable breadcrumb: known words get proper labels and record ids are hidden.
  const SEGMENT_LABELS = { ipd: "IPD", admissions: "Admissions", admit: "Admit", prescriptions: "Prescriptions", write: "Write" };
  const pathSegments = [
    "Practitioner",
    ...pathname
      .split("/")
      .filter((x) => x && !/^[0-9a-f]{24}$/i.test(x))
      .map((x) => SEGMENT_LABELS[x] || x),
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
          <button id="addMedicine" class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
            Add Medicine
          </button>
          <button id="medicalRack" class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
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



  const segments = pathSegments.slice(1);
  const title = PAGE_TITLES[pathname.toLowerCase()] || (/^\/ipd\/admissions\/[0-9a-f]{24}$/i.test(pathname) && "Admission") || (/^\/prescriptions\/[0-9a-f]{24}$/i.test(pathname) && "Prescription") || (segments[segments.length - 1] || "Today").replace(/-/g, " ");
  const fullName = [profileData?.firstName, profileData?.lastName].filter(Boolean).join(" ");
  const initials = `${profileData?.firstName?.[0] || ""}${profileData?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold capitalize text-slate-900">{title}</h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">
            Practitioner
            {segments.map((segment) => (
              <span key={segment}>
                <span className="mx-1.5 text-slate-300">/</span>
                <span className="capitalize">{segment.replace(/-/g, " ")}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {window.location.href.includes("billing") && !showForm && <CustomButton text="+ Add bill" onclick={handleAddBillClick} />}
        {window.location.href.includes("medicines") && !showForm && <CustomButton text="+ Medicines" onclick={handleModalClick} />}
        <div className="relative" ref={createNewModalRef}>
          <button
            onClick={handleCreateNewClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> New
          </button>
          {isCreateNewModalOpen && <CreateNewModal onClose={() => setIsCreateNewModalOpen(false)} />}
        </div>
        <div className="relative" ref={thanosRef}>
          <button onClick={handleHelpClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
          {isHelpModalOpen && <HelpModal />}
        </div>
        <div className="relative">
          <button onClick={handleNotificationClick} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {isNotificationModalOpen && <NotificationModal />}
        </div>
        <div className="relative ml-1" ref={thanosRef}>
          <button onClick={handleProfileClick} className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100">
            {profileData?.imageUrl ? (
              <img src={profileData.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">{initials || "Dr"}</span>
            )}
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-sm font-medium text-slate-900">{fullName ? `Dr. ${fullName}` : "Doctor"}</span>
              <span className="block text-xs text-slate-500">{profileData?.work?.speciality || "Practitioner"}</span>
            </span>
          </button>
          {isProfileModalOpen && <ProfileModal />}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
