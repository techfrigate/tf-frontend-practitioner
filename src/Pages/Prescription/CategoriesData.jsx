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
      icon: <FileTextIcon className="w-4 h-4 text-blue-900" />, // Updated icon
      gradient: "from-blue-100 via-blue-100 to-blue-300",
      buttonColor: "text-blue-900 border-blue-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Vitals",
      description: "Track vital signs like heart rate, blood pressure",
      icon: <HeartIcon className="w-4 h-4 text-red-900" />, // Heart for vitals
      gradient: "from-red-100 via-red-100 to-red-300",
      buttonColor: "text-red-900 border-red-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Chief Complaints",
      description: "Patient's main health issues",
      icon: <StethoscopeIcon className="w-4 h-4 text-green-900" />, // Stethoscope for chief complaints
      gradient: "from-green-100 via-green-100 to-green-300",
      buttonColor: "text-green-900 border-green-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Procedures",
      description: "Details on past medical procedures",
      icon: <SyringeIcon className="w-4 h-4 text-yellow-900" />, // Scalpel for procedures
      gradient: "from-yellow-100 via-yellow-100 to-yellow-300",
      buttonColor: "text-yellow-900 border-yellow-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Diagnosis",
      description: "Current and previous diagnoses",
      icon: <BrainIcon className="w-4 h-4 text-indigo-900" />, // Brain for diagnosis
      gradient: "from-indigo-100 via-indigo-100 to-indigo-300",
      buttonColor: "text-indigo-900 border-indigo-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Medications",
      description: "Current medications the patient is taking",
      icon: <PillIcon className="w-4 h-4 text-orange-900" />, // Pill for medications
      gradient: "from-orange-100 via-orange-100 to-orange-300",
      buttonColor: "text-orange-900 border-orange-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Surgical History",
      description: "List any surgeries performed",
      icon: <ClipboardListIcon className="w-4 h-4 text-purple-900" />, // Keeping the clipboard for surgical history
      gradient: "from-purple-100 via-purple-100 to-purple-300",
      buttonColor: "text-purple-900 border-purple-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Medical History",
      description: "Overall health history of the patient",
      icon: <BriefcaseIcon className="w-4 h-4 text-teal-900" />, // Briefcase for medical history
      gradient: "from-teal-100 via-teal-100 to-teal-300",
      buttonColor: "text-teal-900 border-teal-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Family History",
      description: "Health issues in the family",
      icon: <UsersIcon className="w-4 h-4 text-pink-900" />, // Users for family history
      gradient: "from-pink-100 via-pink-100 to-pink-300",
      buttonColor: "text-pink-900 border-pink-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    },
  ];
  
  export default categories;
  