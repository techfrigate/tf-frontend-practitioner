import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaListAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { FaSuitcaseMedical } from "react-icons/fa6";
import styles from "../../Css/Sidebar/Sidebar.module.css";

import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowUp } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
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
const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [subLinkindex, setSubLinkindex] = useState(null);
  const [openindex, setOpenIndex] = useState(null);
  const [tenant, setTenant] = useState(null);
  const navigate = useNavigate();
  function handleSideClick(index, elm) {
    if (!elm.subLink) {
      setSelectedIndex(() => index);
      setOpenIndex(() => null);
      navigate(elm.route);
    } else {
      if (index !== openindex) {
        setSubLinkindex(null);
      }
      setOpenIndex(() => (openindex === index ? null : index));
    }
  }

  function handleSubLinkClick(index, subelm, elm) {
    setSubLinkindex(() => index);
    setSelectedIndex(() => null);
    navigate(subelm.route);
  }

  const tenantId = Cookies.get("TenantId") || null;

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
          console.log(response.data,"responsedata")
          setTenant(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    fetchTenant();
  }, [tenantId, tenant]); 
  

  return (
    <div className="pb-3 pt-[9px] h-full w-[16%] ">
      <div className="bg-gray-50 pl-[8px]   h-[100%] rounded-md  ">
        <div className="flex items-center gap-2 pt-4 pb-[12px] px-[10px] ml-4 ">
          <img
            src={tenant?.businessInformation?.displayImage}
            alt="tenant Name"
            className="w-10 h-10 object-cover"
          />
          {/* <div className="flex items-center justify-between gap-10">
            <h2 className="text-[20px] font-bold">CareDr</h2>
          </div> */}
        </div>

        <div
          className={`pr-[5px] mt-3 h-[83%] w-full ${styles.customScrollbar}`}
        >
          {sidebarLinks.map((elm, index) => (
            <div
              key={index}
              className={`${
                index === selectedIndex && !elm.subLink
                  ? "text-[#64C6B0] bg-[#FFFFFF]"
                  : "text-black opacity-60"
              } w-[190px] rounded-md mb-2 cursor-pointer ${
                !elm.subLink ? "hover:bg-gray-200" : ""
              }`}
            >
              <div
                className="flex justify-between w-full pl-6 py-[9px] hover:bg-gray-200 h-full rounded-md"
                onClick={() => handleSideClick(index, elm)}
              >
                <div className="flex gap-3 items-center ">
                  {elm.icon}
                  <h2 className="text-base font-medium">{elm.name}</h2>
                </div>
                {elm.subLink && (
                  <MdKeyboardArrowUp
                    className={`mr-4 mt-1 transition-transform ${
                      index === openindex ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
              {index === openindex && elm.subLink && (
                <div className="flex flex-col gap-2 w-[75%] mt-2 box-border ml-auto">
                  {elm.subLink.map((subelm, indexlink) => (
                    <div
                      className={`py-[8px]  ${
                        indexlink === subLinkindex
                          ? "text-[#64C6B0] bg-[#FFFFFF]"
                          : "text-black  font-thin"
                      } hover:bg-gray-200 pl-4 rounded-md`}
                    >
                      <h2
                        key={indexlink}
                        onClick={() =>
                          handleSubLinkClick(indexlink, subelm, elm)
                        }
                        className="text-base font-semibold"
                      >
                        {subelm.name}
                      </h2>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
