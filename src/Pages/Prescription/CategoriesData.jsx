import {
    ClipboardListIcon,
    HeartIcon,
    StethoscopeIcon,
    BriefcaseIcon,
    FileTextIcon,
    PillIcon,
    BrainIcon,
    UsersIcon,
    SyringeIcon,
  } from "lucide-react"; 
  
  const categories = [
    {
      name: "Allergies",
      description: "List any known allergies",
      icon: <FileTextIcon className="w-4 h-4" />, 
      gradient: "from-blue-100 via-blue-100 to-blue-300",
      buttonColor: "text-blue-900 border-blue-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"AllergyIntolerance"
    },
    {
      name: "Vitals",
      description: "Track vital signs and measurements",
      icon: <HeartIcon className="w-4 h-4" />, 
      gradient: "from-red-100 via-red-100 to-red-300",
      buttonColor: "text-red-900 border-red-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Observation"
    },
    {
      name: "Chief Complaints",
      description: "Patient's primary symptoms and concerns",
      icon: <StethoscopeIcon className="w-4 h-4" />, 
      gradient: "from-green-100 via-green-100 to-green-300",
      buttonColor: "text-green-900 border-green-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Condition"
    },
    {
      name: "Procedures",
      description: "Medical procedures and treatments",
      icon: <SyringeIcon className="w-4 h-4" />, 
      gradient: "from-yellow-100 via-yellow-100 to-yellow-300",
      buttonColor: "text-yellow-900 border-yellow-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Procedure"
    },
    {
      name: "Diagnosis",
      description: "Clinical diagnoses and findings",
      icon: <BrainIcon className="w-4 h-4" />,
      gradient: "from-indigo-100 via-indigo-100 to-indigo-300",
      buttonColor: "text-indigo-900 border-indigo-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Condition"
    },
    {
      name: "Medications",
      description: "Current medications the patient is taking",
      icon: <PillIcon className="w-4 h-4" />,
      gradient: "from-orange-100 via-orange-100 to-orange-300",
      buttonColor: "text-orange-900 border-orange-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"MedicationStatement"
    },
    {
      name: "Surgical History",
      description: "Past surgical procedures and outcomes",
      icon: <ClipboardListIcon className="w-4 h-4" />, 
      gradient: "from-purple-100 via-purple-100 to-purple-300",
      buttonColor: "text-purple-900 border-purple-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Procedure"
    },
    {
      name: "Medical History",
      description: "Overall health history of the patient",
      icon: <BriefcaseIcon className="w-4 h-4" />, 
      gradient: "from-teal-100 via-teal-100 to-teal-300",
      buttonColor: "text-teal-900 border-teal-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"Condition"
    },
    {
      name: "Family History",
      description: "Hereditary conditions and history",
      icon: <UsersIcon className="w-4 h-4" />,
      gradient: "from-pink-100 via-pink-100 to-pink-300",
      buttonColor: "text-pink-900 border-pink-900",
      backgroundImage: "https://plus.unsplash.com/premium_vector-1682269359035-d0de2962d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      resourceType:"FamilyMemberHistory"
    },
  ];
  
  export default categories;
  