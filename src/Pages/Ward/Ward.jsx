// import { useDispatch, useSelector } from "react-redux";
// import React, {useRef} from "react";
// import {
//   setSelectedBuilding,
//   setSelectedFloor,
//   setSelectedWard,
//   setSelectedBed,
//   updateBedStatus,
// } from "../../Store/wardSlice";
// import { useEffect, useState } from "react";
// import { fetchLocations } from "../../Store/locationSlice";
// import { fetchBuildings, bookBed } from "../../Store/wardSlice";
// import {
//   Building,
//   Layers2,
//   ChevronDown,
//   MapPin,
//   Hospital,
//   Bed as BedIcon,
//   Search,
//   Phone,
//   Calendar
// } from "lucide-react";
// import { fetchPatients } from "../../Store/patientSlice";

// const WardBed = ({ bed, onClick }) => {
//     const [showDropdown, setShowDropdown] = useState(false);
//   const [search, setSearch] = useState("");
//   const dropdownRef = useRef(null);
//   const dispatch = useDispatch();
//   const { patients = [] } = useSelector((state) => state.patient);

//   useEffect(() => {
//     dispatch(fetchPatients({ page: null, limit: 50 }));
//   }, [dispatch]);

//     const calculateAge = (dob) => {
//     if (!dob) return "N/A";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }
//     return age;
//   };

//   const getAgeDisplay = (dob) => `${calculateAge(dob)} years`; 

//   const filteredPatients = patients.filter((p) =>
//     `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.email}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const getBedStyles = () => {
//     switch (bed.status) {
//       case "booked":
//         return "bg-gray-100 border-gray-300 cursor-not-allowed";
//       // case "selected":
//       //   return "bg-blue-50 border-blue-500 ring-2 ring-blue-500 ring-opacity-50";
//       default:
//         return "bg-white hover:bg-blue-50 hover:border-blue-400";
//     }
//   };

//   const handleBedClick = () => {
//     if (bed.status !== "booked") {
//       setShowDropdown((prev) => !prev);
//       onClick(bed);
//     }
//   };

//    const handlePatientSelect = (patient) => {
//     const numericAge = calculateAge(patient.dob);
    
//     const phoneNumber = typeof patient.phoneNumber === "object"
//       ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
//       : patient.phoneNumber;

//     const userData = {
//       name: `${patient.firstName} ${patient.lastName}`,
//       email: patient.email,
//       phone: phoneNumber,
//       age: numericAge,
//       bedStatus: "booked",
//       bedNumber: bed.number,
//       bedId: bed._id,
//       patientId: patient._id,
//     };

//     console.log("Booking bed with data:", userData);
//     dispatch(
//       bookBed({
//         bedId: bed._id,
//         userData,
//       })
//     );
//     setShowDropdown(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };

//     if (showDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   return (
//     <div className="relative" ref={dropdownRef}>
//     <div
//       className={`w-24 h-28 border-2 rounded-xl ${getBedStyles()} 
//         transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer`}
//       onClick={handleBedClick} 
//     >
//       <div className="flex flex-col items-center justify-center h-full p-3 text-center">
//         <BedIcon
//           className={
//             bed.status === "booked" ? "text-gray-400" : "text-blue-500"
//           }
//           size={20}
//         />
//         <span
//           className={`mt-2 text-sm font-medium ${
//             bed.status === "booked" ? "text-gray-500" : "text-gray-700"
//           }`}
//         >
//           Bed {bed.number}
//         </span>

//         {bed.status === "booked" && bed.user ? (
//           <div className="mt-2 text-xs text-gray-600 space-y-0.5">
//             <div className="font-semibold">{bed.user.name}</div>
//             <div>{bed.user.age} years</div>
//             <div>{bed.user.phone}</div>
//           </div>
//         ) : (
//           <div className="mt-2 h-16"></div>
//           )}
//           </div>

//           {bed.status === "booked" && (
//           <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-200 text-[10px] px-2 py-0.5 rounded-full text-gray-600">
//             Occupied
//           </span>
//         )}
//     </div>

//      {/* Dropdown */}
//       {showDropdown && (
//         <div className="absolute z-50 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
//           {/* Search bar */}
//           <div className="relative mb-2">
//             <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           {/* Options */}
//           <div className="max-h-56 overflow-y-auto scrollbar-hide">
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((patient) => (
//                 <button
//                   key={patient._id}
//                   className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 flex flex-col gap-1 border-b last:border-none"
//                   onClick={() => {
//                     console.log("Selected:", patient, "for Bed:", bed.number);
//                      handlePatientSelect(patient);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   <div className="font-medium text-gray-800">
//                     {patient.firstName} {patient.lastName}
//                   </div>
//                   <div className="flex items-center text-xs text-gray-600 gap-1">
//                     <Phone size={12} /> {typeof patient.phoneNumber === "object"
//                       ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
//                       : patient.phoneNumber}
//                   </div>
//                   <div className="flex items-center text-xs text-gray-600 gap-1">
//                     <Calendar size={12} /> Age: {getAgeDisplay(patient.dob)}
//                   </div>
//                 </button>
//               ))
//             ) : (
//               <p className="text-xs text-gray-400 text-center py-2">No results</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const Ward = ({ onCreateClick }) => {
//   const dispatch = useDispatch();
//   const { buildings, selectedBuilding, selectedFloor, selectedWard } =
//     useSelector((state) => state.ward);
//   const { locations, fetchStatus } = useSelector((state) => state.locations);

//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [expandedBuilding, setExpandedBuilding] = useState(selectedBuilding);
//   const [expandedFloor, setExpandedFloor] = useState(selectedFloor);

//   useEffect(() => {
//     dispatch(
//       fetchLocations({
//         currentPage: 1,
//         itemsPerPage: 20,
//         sortBy: "name",
//         order: "asc",
//       })
//     );
//   }, [dispatch]);

//   const handleLocationChange = (event) => {
//     const locationId = event.target.value;
//     setSelectedLocation(locationId);
//     setExpandedBuilding(null);
//     setExpandedFloor(null);
//     dispatch(setSelectedBuilding(null));
//     dispatch(setSelectedFloor(null));
//     dispatch(setSelectedWard(null));
//     dispatch(fetchBuildings(locationId));
//   };

//   const handleBuildingClick = (buildingId) => {
//     setExpandedBuilding(expandedBuilding === buildingId ? null : buildingId);
//     dispatch(setSelectedBuilding(buildingId));
//     setExpandedFloor(null);
//     dispatch(setSelectedWard(null));
//   };

//   const handleFloorClick = (floorLevel) => {
//     setExpandedFloor(expandedFloor === floorLevel ? null : floorLevel);
//     dispatch(setSelectedFloor(floorLevel));
//     dispatch(setSelectedWard(null));
//   };

//   const handleWardClick = (wardId) => {
//     dispatch(setSelectedWard(wardId));
//   };

//   const handleBedClick = (bed, wardId, floorLevel, buildingId) => {
//     if (bed.status === "available") {
//       dispatch(setSelectedBed(bed._id));
//       dispatch(
//         updateBedStatus({
//           buildingId,
//           floorLevel,
//           wardId,
//           bedId: bed._id,
//           status: "booked",
//         })
//       );
//     }
//   };

//   const getSelectedWardData = () => {
//     for (let b of buildings) {
//       for (let f of b.floors) {
//         for (let w of f.wards) {
//           if (w._id === selectedWard) {
//             return { ...w, floor: f.level, building: b._id };
//           }
//         }
//       }
//     }
//     return null;
//   };

//   const selectedWardData = getSelectedWardData();

//   return (
//     <div className="flex gap-6">
//       <div className="w-[350px] pb-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex-shrink-0 min-h-[150px] sticky top-0 max-h-[80vh] customScrollbar border border-gray-100 overflow-hidden">
//         <div className="space-y-4 h-full w-full">
//           <div className="flex items-center justify-between mb-6 px-5 pt-5">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <Hospital size={20} className="text-blue-600" />
//               Ward Manager
//             </h2>
//           </div>

//           <div className="flex gap-3 px-5">
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//                 <MapPin size={18} className="text-blue-500" />
//               </div>
//               <select
//                 value={selectedLocation || ""}
//                 onChange={handleLocationChange}
//                 className="w-full pl-10 cursor-pointer pr-4 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
//               >
//                 <option value="" disabled>
//                   {fetchStatus === "loading" ? "Loading..." : "Select Location"}
//                 </option>
//                 {locations?.map((location) => (
//                   <option key={location._id} value={location._id}>
//                     {location.displayName}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
//                 <ChevronDown size={18} className="text-gray-500" />
//               </div>
//             </div>
//           </div>

//           <div className="px-5">
//             {buildings?.length > 0 ? (
//               <div className="space-y-3 mt-6 w-full">
//                 {buildings.map((building) => (
//                   <div
//                     key={building._id}
//                     className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 w-full"
//                   >
//                     <button
//                       onClick={() => handleBuildingClick(building._id)}
//                       className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${
//                         expandedBuilding === building._id
//                           ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
//                           : "bg-blue-50 text-blue-700 hover:bg-blue-100"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <Building size={20} />
//                         <span className="font-semibold">{building.name}</span>
//                       </div>
//                       <ChevronDown
//                         size={20}
//                         className={`transition-transform ${
//                           expandedBuilding === building._id
//                             ? "rotate-180"
//                             : "rotate-0"
//                         }`}
//                       />
//                     </button>

//                     <div
//                       className={`overflow-hidden transition-all duration-300 ${
//                         expandedBuilding === building._id
//                           ? "max-h-[2000px] opacity-100"
//                           : "max-h-0 opacity-0"
//                       }`}
//                     >
//                       <div className="p-3 bg-gray-50 space-y-3">
//                         {building.floors.map((floor) => (
//                           <div key={floor.level}>
//                             <button
//                               onClick={() => handleFloorClick(floor.level)}
//                               className={`w-full flex items-center justify-between p-3.5 border-2 rounded-xl transition-all duration-300 ${
//                                 expandedFloor === floor.level
//                                   ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
//                                   : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-gray-200"
//                               }`}
//                             >
//                               <div className="flex items-center space-x-3">
//                                 <Layers2 size={20} />
//                                 <span className="font-semibold">
//                                   Floor {floor.level}
//                                 </span>
//                               </div>
//                               <ChevronDown
//                                 size={20}
//                                 className={`transition-transform ${
//                                   expandedFloor === floor.level
//                                     ? "rotate-180"
//                                     : "rotate-0"
//                                 }`}
//                               />
//                             </button>

//                             <div
//                               className={`overflow-hidden transition-all duration-300 ${
//                                 expandedFloor === floor.level
//                                   ? "max-h-[2000px] opacity-100"
//                                   : "max-h-0 opacity-0"
//                               }`}
//                             >
//                               <div className="pl-4 space-y-2">
//                                 {floor.wards.map((ward) => (
//                                   <div key={ward._id}>
//                                     <button
//                                       onClick={() => handleWardClick(ward._id)}
//                                       className={`w-full text-left p-3 border rounded-xl transition-all duration-300 ${
//                                         selectedWard === ward._id
//                                           ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
//                                           : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-gray-200"
//                                       }`}
//                                     >
//                                       {ward.name}
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-xl mt-6">
//                 <Building size={40} className="mb-3 text-gray-400" />
//                 <p className="text-center font-medium">No Buildings Found</p>
//                 <p className="text-sm text-gray-400">
//                   Please select a location to load buildings
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
//         {selectedWardData ? (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold">{selectedWardData.name}</h2>
//             </div>

//             <div className="grid grid-cols-4 gap-4">
//               {selectedWardData.beds?.map((bed) => (
//                 <WardBed
//                   key={bed._id}
//                   bed={bed}
//                   onClick={(b) =>
//                     handleBedClick(
//                       b,
//                       selectedWardData._id,
//                       selectedWardData.floor,
//                       selectedWardData.building
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500">Select a ward to see beds</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Ward;
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useEffect, useState } from "react";
import {
  setSelectedBuilding,
  setSelectedFloor,
  setSelectedWard,
  setSelectedBed,
  updateBedStatus,
  fetchBuildings,
  fetchFloors,
  fetchWards,
  fetchBeds,
  bookBed,
} from "../../Store/wardSlice";
import { fetchLocations } from "../../Store/locationSlice";
import { fetchPatients } from "../../Store/patientSlice";
import {
  Building,
  Layers2,
  ChevronDown,
  MapPin,
  Hospital,
  Bed as BedIcon,
  Search,
  Phone,
  Calendar,
} from "lucide-react";

const WardBed = ({ bed, onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { patients = [] } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatients({ page: null, limit: 50 }));
  }, [dispatch]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeDisplay = (dob) => `${calculateAge(dob)} years`;

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getBedStyles = () => {
    switch (bed.status) {
      case "booked":
        return "bg-gray-100 border-gray-300 cursor-not-allowed";
      default:
        return "bg-white hover:bg-blue-50 hover:border-blue-400";
    }
  };

  const handleBedClick = () => {
    if (bed.status !== "booked") {
      setShowDropdown((prev) => !prev);
      onClick(bed);
    }
  };

  const handlePatientSelect = (patient) => {
    const userData = {
      bedStatus: "booked",
      bedId: bed._id,
      patientId: patient._id,
    };

    console.log("Booking bed with data:", userData);
    dispatch(
      bookBed({
        bedId: bed._id,
        userData,
      })
    );
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-24 h-28 border-2 rounded-xl ${getBedStyles()} 
        transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer`}
        onClick={handleBedClick}
      >
        <div className="flex flex-col items-center justify-center h-full p-3 text-center">
          <BedIcon
            className={bed.status === "booked" ? "text-gray-400" : "text-blue-500"}
            size={20}
          />
          <span
            className={`mt-2 text-sm font-medium ${
              bed.status === "booked" ? "text-gray-500" : "text-gray-700"
            }`}
          >
            Bed {bed.number}
          </span>
        </div>

        {bed.status === "booked" && (
          <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-200 text-[10px] px-2 py-0.5 rounded-full text-gray-600">
            Occupied
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          {/* Search bar */}
          <div className="relative mb-2">
            <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="max-h-56 overflow-y-auto scrollbar-hide">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <button
                  key={patient._id}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 flex flex-col gap-1 border-b last:border-none"
                  onClick={() => {
                    console.log("Selected:", patient, "for Bed:", bed.number);
                    handlePatientSelect(patient);
                    setShowDropdown(false);
                  }}
                >
                  <div className="font-medium text-gray-800">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-1">
                    <Phone size={12} />{" "}
                    {typeof patient.phoneNumber === "object"
                      ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
                      : patient.phoneNumber}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-1">
                    <Calendar size={12} /> Age: {getAgeDisplay(patient.dob)}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Ward = () => {
  const dispatch = useDispatch();
  const { buildings, selectedBuilding, selectedFloor, selectedWard } =
    useSelector((state) => state.ward);
  const { locations, fetchStatus } = useSelector((state) => state.locations);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [expandedBuilding, setExpandedBuilding] = useState(selectedBuilding);
  const [expandedFloor, setExpandedFloor] = useState(selectedFloor);

  useEffect(() => {
    dispatch(
      fetchLocations({
        currentPage: 1,
        itemsPerPage: 20,
        sortBy: "name",
        order: "asc",
      })
    );
  }, [dispatch]);

  const handleLocationChange = (event) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    setExpandedBuilding(null);
    setExpandedFloor(null);
    dispatch(setSelectedBuilding(null));
    dispatch(setSelectedFloor(null));
    dispatch(setSelectedWard(null));
    dispatch(fetchBuildings(locationId));
  };

  const handleBuildingClick = (buildingId) => {
    const isExpanded = expandedBuilding === buildingId;
    setExpandedBuilding(isExpanded ? null : buildingId);
    dispatch(setSelectedBuilding(buildingId));
    setExpandedFloor(null);
    dispatch(setSelectedFloor(null));
    dispatch(setSelectedWard(null));

    if (!isExpanded) {
      dispatch(fetchFloors(buildingId));
    }
  };

  const handleFloorClick = (floor) => {
    const isExpanded = expandedFloor === floor._id;
    setExpandedFloor(isExpanded ? null : floor._id);
    dispatch(setSelectedFloor(floor._id));
    dispatch(setSelectedWard(null));

    if (!isExpanded) {
      dispatch(fetchWards(floor._id));
    }
  };

  const handleWardClick = (wardId) => {
    dispatch(setSelectedWard(wardId));
    dispatch(setSelectedBed(null));
    dispatch(fetchBeds(wardId));
  };

  const handleBedClick = (bed, wardId, floorLevel, buildingId) => {
    if (bed.status === "available") {
      dispatch(setSelectedBed(bed._id));
      dispatch(
        updateBedStatus({
          bedId: bed._id,
          bedStatus: "booked",
        })
      );
    }
  };

  const getSelectedWardData = () => {
    for (let b of buildings) {
      if (!b.floors) continue;
      for (let f of b.floors) {
        if (!f.wards) continue;
        for (let w of f.wards) {
          if (w._id === selectedWard) {
            return { ...w, floor: f.level, building: b._id };
          }
        }
      }
    }
    return null;
  };

  const selectedWardData = getSelectedWardData();

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-[350px] pb-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex-shrink-0 min-h-[150px] sticky top-0 max-h-[80vh] customScrollbar border border-gray-100 overflow-hidden">
        <div className="space-y-4 h-full w-full">
          <div className="flex items-center justify-between mb-6 px-5 pt-5">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Hospital size={20} className="text-blue-600" />
              Ward Manager
            </h2>
          </div>

          {/* Location Dropdown */}
          <div className="flex gap-3 px-5">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <select
                value={selectedLocation || ""}
                onChange={handleLocationChange}
                className="w-full pl-10 cursor-pointer pr-4 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                <option value="" disabled>
                  {fetchStatus === "loading" ? "Loading..." : "Select Location"}
                </option>
                {locations?.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.displayName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Buildings / Floors / Wards */}
          <div className="px-5">
            {buildings?.length > 0 ? (
              <div className="space-y-3 mt-6 w-full">
                {buildings.map((building) => (
                  <div
                    key={building._id}
                    className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 w-full"
                  >
                    {/* Building */}
                    <button
                      onClick={() => handleBuildingClick(building._id)}
                      className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${
                        expandedBuilding === building._id
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Building size={20} />
                        <span className="font-semibold">{building.name}</span>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          expandedBuilding === building._id ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {/* Floors */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedBuilding === building._id
                          ? "max-h-[2000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-3 bg-gray-50 space-y-3">
                        {building.floors?.map((floor) => (
                          <div key={floor._id}>
                            <button
                              onClick={() => handleFloorClick(floor)}
                              className={`w-full flex items-center justify-between p-3.5 border-2 rounded-xl transition-all duration-300 ${
                                expandedFloor === floor._id
                                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Layers2 size={20} />
                                <span className="font-semibold">Floor {floor.level}</span>
                              </div>
                              <ChevronDown
                                size={20}
                                className={`transition-transform ${
                                  expandedFloor === floor._id ? "rotate-180" : "rotate-0"
                                }`}
                              />
                            </button>

                            {/* Wards */}
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                expandedFloor === floor._id
                                  ? "max-h-[2000px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="pl-4 space-y-2">
                                {floor.wards?.map((ward) => (
                                  <div key={ward._id}>
                                    <button
                                      onClick={() => handleWardClick(ward._id)}
                                      className={`w-full text-left p-3 border rounded-xl transition-all duration-300 ${
                                        selectedWard === ward._id
                                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-gray-200"
                                      }`}
                                    >
                                      {ward.name}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-xl mt-6">
                <Building size={40} className="mb-3 text-gray-400" />
                <p className="text-center font-medium">No Buildings Found</p>
                <p className="text-sm text-gray-400">
                  Please select a location to load buildings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Beds Right Panel */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
        {selectedWardData ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{selectedWardData.name}</h2>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {selectedWardData.beds?.map((bed) => (
                <WardBed
                  key={bed._id}
                  bed={bed}
                  onClick={(b) =>
                    handleBedClick(
                      b,
                      selectedWardData._id,
                      selectedWardData.floor,
                      selectedWardData.building
                    )
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a ward to see beds</p>
        )}
      </div>
    </div>
  );
};

export default Ward;
