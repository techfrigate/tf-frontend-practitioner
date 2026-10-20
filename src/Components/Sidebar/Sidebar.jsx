import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Archive, BedDouble, Building2, ClipboardList, FileText, UserPlus, CalendarCheck, CalendarDays, CalendarPlus, MonitorSmartphone, Pill, Receipt, Users, X } from "lucide-react";
import { useTenantBranding } from "../../hooks/useTenantBranding";

const sections = [
  {
    title: "Appointments",
    links: [
      { name: "Appointments", icon: CalendarCheck, route: "/appointments", end: true },
      { name: "Calendar", icon: CalendarDays, route: "/calendar" },
      { name: "Teleconsult worklist", icon: MonitorSmartphone, route: "/worklist" },
    ],
  },
  {
    title: "Clinical",
    links: [
      { name: "Patients", icon: Users, route: "/patients" },
      { name: "Prescriptions", icon: FileText, route: "/prescriptions" },
    ],
  },
  {
    title: "Inpatients (IPD)",
    links: [
      { name: "Bed board", icon: BedDouble, route: "/ipd", end: true },
      { name: "Admissions", icon: ClipboardList, route: "/ipd/admissions" },
      { name: "Admit patient", icon: UserPlus, route: "/ipd/admit" },
    ],
  },
  {
    title: "Pharmacy & billing",
    links: [
      { name: "Medicines", icon: Pill, route: "/medicines" },
      { name: "Medical racks", icon: Archive, route: "/MedicalRackApp" },
      { name: "Billing", icon: Receipt, route: "/billing" },
    ],
  },
];

const itemBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

const Sidebar = ({ isOpen, onClose }) => {
  const { image, name } = useTenantBranding();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const onNavigate = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col bg-navy-900">
        <div className="flex h-16 items-center justify-between gap-3 border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            {image ? (
              <img src={image} alt="" className="h-9 w-9 shrink-0 rounded-lg bg-white object-cover ring-1 ring-white/10" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Building2 className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-white">{name || "Hospital"}</p>
              <p className="text-xs text-slate-400">Practitioner workspace</p>
            </div>
          </div>
          <button className="rounded-md p-1 text-slate-400 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pt-5">
          <button
            onClick={() => {
              navigate("/appointments/new");
              onNavigate();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-400"
          >
            <CalendarPlus className="h-4 w-4" /> New appointment
          </button>
        </div>

        <nav className="customScrollbar flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{section.title}</p>
              <div className="space-y-0.5">
                {section.links.map(({ name: label, icon: Icon, route, end }) => (
                  <NavLink
                    key={route}
                    to={route}
                    end={end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
                    }
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs text-slate-400">Powered by Health Frigate</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
