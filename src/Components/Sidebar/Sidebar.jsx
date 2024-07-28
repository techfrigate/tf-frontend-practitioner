import React, { useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaListAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import styles from "../../Css/Sidebar/Sidebar.module.css";

import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowUp } from "react-icons/md";

const sidebarLinks = [
  {
    name: "Worklist",
    icon: <FaListAlt size={21} />,
    route: "/",
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
  // {
  //   name: "Worklist 2",
  //   icon: <FaListAlt size={21} />,
  //   route: "/workitem",
  // },
  {
    name: "Billing",
    icon: <FaFileInvoiceDollar size={21} />,
    route: "/billing",
  },
];

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [subLinkindex, setSubLinkindex] = useState(null);
  const [openindex, setOpenIndex] = useState(null);

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

  return (
    <div className="bg-gray-50 pl-[8px] h-[100%] ">
      <div className="flex flex-col gap-5"></div>
      <div className="flex items-center gap-2 pt-[10px] pb-[12px] px-[10px] mt-3">
        <img
          src="https://dev-central.unify.care/build/_assets/shortLogo-ZSVGBGEP.svg"
          alt=""
        />
        <div className="flex items-center justify-between gap-10">
          <h2 className="text-[20px] font-bold">CareDr</h2>
        </div>
      </div>

      <div className={` pr-[5px] mt-3 h-[83%] w-max ${styles.customScrollbar}`}>
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
                      onClick={() => handleSubLinkClick(indexlink, subelm, elm)}
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
  );
};

export default Sidebar;
