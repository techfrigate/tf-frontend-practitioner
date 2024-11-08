import {
    ClipboardListIcon,
    HeartIcon,
    StethoscopeIcon,
    BriefcaseIcon,
    FileTextIcon,
    PillIcon,
    ScalpelIcon,
    BrainIcon,
    UsersIcon,
    SyringeIcon,
  } from "lucide-react"; // Importing additional Lucide icons
  
  const categories = [
    {
      name: "Allergies",
      description: "List any known allergies",
      icon: <FileTextIcon className="w-5 h-5 text-blue-600" />, // Updated icon
      gradient: "from-blue-100 via-blue-100 to-blue-300",
      buttonColor: "text-blue-600 border-blue-600",
    },
    {
      name: "Vitals",
      description: "Track vital signs like heart rate, blood pressure",
      icon: <HeartIcon className="w-5 h-5 text-red-600" />, // Heart for vitals
      gradient: "from-red-100 via-red-100 to-red-300",
      buttonColor: "text-red-600 border-red-600",
    },
    {
      name: "Chief Complaints",
      description: "Patient's main health issues",
      icon: <StethoscopeIcon className="w-5 h-5 text-green-600" />, // Stethoscope for chief complaints
      gradient: "from-green-100 via-green-100 to-green-300",
      buttonColor: "text-green-600 border-green-600",
    },
    {
      name: "Procedures",
      description: "Details on past medical procedures",
      icon: <SyringeIcon className="w-5 h-5 text-yellow-600" />, // Scalpel for procedures
      gradient: "from-yellow-100 via-yellow-100 to-yellow-300",
      buttonColor: "text-yellow-600 border-yellow-600",
    },
    {
      name: "Diagnosis",
      description: "Current and previous diagnoses",
      icon: <BrainIcon className="w-5 h-5 text-indigo-600" />, // Brain for diagnosis
      gradient: "from-indigo-100 via-indigo-100 to-indigo-300",
      buttonColor: "text-indigo-600 border-indigo-600",
    },
    {
      name: "Medications",
      description: "Current medications the patient is taking",
      icon: <PillIcon className="w-5 h-5 text-orange-600" />, // Pill for medications
      gradient: "from-orange-100 via-orange-100 to-orange-300",
      buttonColor: "text-orange-600 border-orange-600",
    },
    {
      name: "Surgical History",
      description: "List any surgeries performed",
      icon: <ClipboardListIcon className="w-5 h-5 text-purple-600" />, // Keeping the clipboard for surgical history
      gradient: "from-purple-100 via-purple-100 to-purple-300",
      buttonColor: "text-purple-600 border-purple-600",
    },
    {
      name: "Medical History",
      description: "Overall health history of the patient",
      icon: <BriefcaseIcon className="w-5 h-5 text-teal-600" />, // Briefcase for medical history
      gradient: "from-teal-100 via-teal-100 to-teal-300",
      buttonColor: "text-teal-600 border-teal-600",
    },
    {
      name: "Family History",
      description: "Health issues in the family",
      icon: <UsersIcon className="w-5 h-5 text-pink-600" />, // Users for family history
      gradient: "from-pink-100 via-pink-100 to-pink-300",
      buttonColor: "text-pink-600 border-pink-600",
    },
  ];
  
  export default categories;
  