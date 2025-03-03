import React, { useEffect, useState, useRef } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaListAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { MdKeyboardArrowUp } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
 
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";


const sidebarLinks = [
  {
    name: "Worklist",
    icon: <FaListAlt size={21} />,
    route: "/worklist",
  },
  {
    name: "Patients",
    icon: <FaUsers size={21} />,
    route: "/patients",
  },
  {
    name: "Calendar",
    icon: <FaCalendarAlt size={21} />,
    route: "/calendar",
  },
  {
    name: "Medicines",
    icon: <FaSuitcaseMedical size={21} />,
    route: "/medicines",
  },
  {
    name: "Billing",
    icon: <FaFileInvoiceDollar size={21} />,
    route: "/billing",
  },
];

const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;

const Sidebar = ({ isOpen, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [subLinkindex, setSubLinkindex] = useState(null);
  const [openindex, setOpenIndex] = useState(null);
  const [tenant, setTenant] = useState(null);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const tenantId = Cookies.get("TenantId") || null;


  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const mainIndex = sidebarLinks.findIndex(link => link.route === currentPath);
    if (mainIndex !== -1) {
      setSelectedIndex(mainIndex);
      setOpenIndex(null);
    } else {
      setSelectedIndex(null);
      setOpenIndex(null);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const fetchTenant = async () => {
      if (tenantId && !tenant) {
        try {
          const response = await axios.get(
            `${ACCOUNTS_URL}/tenants/tenant/${tenantId}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
              },
            }
          );
          setTenant(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchTenant();
  }, [tenantId, tenant]);

  const handleSideClick = (index, elm) => {
    if (!elm.subLink) {
      setSelectedIndex(index);
      setOpenIndex(null);
      navigate(elm.route);
    } else {
      if (index !== openindex) {
        setSubLinkindex(null);
      }
      setOpenIndex(openindex === index ? null : index);
    }
  };

  const handleSubLinkClick = (index, subelm) => {
    setSubLinkindex(index);
    setSelectedIndex(null);
    navigate(subelm.route);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <aside
      ref={sidebarRef}
      className={`w-60 min-w-60 h-full pl-2 pt-2 pb-3 fixed z-50 top-0 left-0 lg:static lg:block transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full border-r border-gray-200 bg-white rounded-md">
        
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="w-10 h-10">
            <img
              src={tenant?.businessInformation?.displayImage}
              alt="Tenant Logo"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
         
            <button className="lg:hidden" onClick={onClose}>
              <AiOutlineClose size={24} />
            </button>
        
        </div>
        <nav className="flex-1 overflow-y-auto pr-4 pl-2 py-6 space-y-1 customScrollbar">
          {sidebarLinks.map((elm, index) => (
            <div key={index} className="space-y-1">
              <div
                onClick={() => handleSideClick(index, elm)}
                className={`cursor-pointer rounded-md px-4 py-2 ${
                  index === selectedIndex && !elm.subLink
                    ? "bg-[#FFFFFF] text-[#64C6B0]"
                    : "text-black font-thin opacity-60 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {elm.icon}
                  <h2 className="text-base font-semibold">{elm.name}</h2>
                </div>
              </div>
              {index === openindex && elm.subLink && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#c6f2e9] pl-3">
                  {elm.subLink.map((subelm, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubLinkClick(subIndex, subelm)}
                      className={`cursor-pointer rounded-md px-4 py-2 ${
                        subIndex === subLinkindex
                          ? "bg-[#FFFFFF] text-[#64C6B0]"
                          : "text-black opacity-60 hover:bg-gray-200"
                      }`}
                    >
                      <h2 className="text-base font-semibold">
                        {subelm.name}
                      </h2>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
