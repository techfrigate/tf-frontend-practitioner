// import { useDispatch, useSelector } from "react-redux";
// import React, { useRef, useEffect, useState } from "react";
// import { bookBed, fetchAllBookedBeds } from "../../Store/wardSlice";
// import { fetchPatients } from "../../Store/patientSlice";
// import { Bed as BedIcon, Search, Phone, Calendar } from "lucide-react";

// const WardBed = ({ bed, onClick }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [search, setSearch] = useState("");
//   const dropdownRef = useRef(null);
//   const dispatch = useDispatch();
//   const { patients = [] } = useSelector((state) => state.patient);

//   useEffect(() => {
//     dispatch(fetchPatients({ page: null, limit: 50 }));
//   }, [dispatch]);

//   const calculateAge = (dob) => {
//     if (!dob) return "N/A";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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

//   const handleBedClick = () => {
//     if (bed.status !== "booked") {
//       setShowDropdown((prev) => !prev);
//       onClick(bed);
//     }
//   };

//   const handlePatientSelect = (patient) => {
//     const userData = {
//       bedStatus: "booked",
//       bedId: bed._id,
//       patientId: patient._id,
//     };

//     dispatch(bookBed({ bedId: bed._id, userData })).then(() => {
//       dispatch(fetchAllBookedBeds());
//     });
//     setShowDropdown(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
//       <div
//         className={`w-28 h-32 border rounded-lg transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer
//           ${bed.status === "booked" ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-200"}`}
//         onClick={handleBedClick}
//       >
//         <div className="flex flex-col h-full p-1.5">
//           <div className="flex items-center justify-between mb-1">
//             <BedIcon
//               className={`${bed.status === "booked" ? "text-red-500" : "text-blue-500"}`}
//               size={12}
//             />
//             <span
//               className={`font-bold text-xs ${
//                 bed.status === "booked" ? "text-red-600" : "text-blue-500"
//               }`}
//             >
//               #{bed.number}
//             </span>
//           </div>

//           <div className="flex justify-center mb-1">
//             <span
//               className={`text-[10px] font-semibold px-1 py-0.5 rounded-full tracking-wide ${
//                 bed.status === "booked"
//                   ? "text-red-700 bg-red-200 border border-red-300"
//                   : "text-green-700 bg-green-200 border border-green-300"
//               }`}
//             >
//               {bed.status === "booked" ? "BOOKED" : "AVAILABLE"}
//             </span>
//           </div>

//           {bed.status === "booked" && bed.patient ? (
//             <div className="bg-white rounded-md p-1 shadow-sm border border-red-100 text-xs flex flex-col flex-grow">
//               <p className="font-bold text-red-700 text-center truncate text-[10px]">
//                 {bed.patient.firstName} {bed.patient.lastName}
//               </p>
//               <div className="flex justify-center pt-1 pb-1 ">
//                 <span className="text-[10px] text-gray-500">Age:</span>
//                 <span className="font-bold text-gray-600 px-1 text-[10px]">
//                   {bed.patient.age || (bed.patient.dob ? calculateAge(bed.patient.dob) : "-")}
//                 </span>
//               </div>
//               <div className="flex items-center justify-center bg-red-50 rounded-md p-0.5 ">
//                 <Phone size={8} className="text-red-600 mr-0.5 " />
//                 <span className="font-mono text-[10px] text-red-700 truncate ">
//                   {bed.patient.phone?.mobile ||
//                   (bed.patient.phone?.dialCode && bed.patient.phone?.value
//                     ? `${bed.patient.phone.dialCode}${bed.patient.phone.value}`
//                     : bed.patient.phoneNumber
//                     ? typeof bed.patient.phoneNumber === "object"
//                       ? `${bed.patient.phoneNumber.dialCode} ${bed.patient.phoneNumber.value}`
//                       : bed.patient.phoneNumber
//                     : "-")}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center flex-grow">
//               <span className="text-xl mb-2">🛏️</span>
//               <p className="text-blue-700 font-medium text-[12px]">Ready for patient</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {showDropdown && (
//         <div className="absolute z-50 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
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
//           <div className="max-h-40 overflow-y-auto scrollbar-hide">
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((patient) => (
//                 <button
//                   key={patient._id}
//                   className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 flex flex-col gap-1 border-b last:border-none"
//                   onClick={() => {
//                     handlePatientSelect(patient);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   <div className="font-medium text-gray-800">
//                     {patient.firstName} {patient.lastName}
//                   </div>
//                   <div className="flex items-center text-xs text-gray-600 gap-1">
//                     <Phone size={12} />{" "}
//                     {typeof patient.phoneNumber === "object"
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

// export default WardBed;

// import { useDispatch, useSelector } from "react-redux";
// import React, { useEffect, useState } from "react";
// import { bookBed, fetchAllBookedBeds } from "../../Store/wardSlice";
// import { fetchPatients } from "../../Store/patientSlice";
// import { Bed as BedIcon, Search, Phone, Calendar } from "lucide-react";

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           ✖
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const WardBed = ({ bed, onClick }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const dispatch = useDispatch();
//   const { patients = [] } = useSelector((state) => state.patient);

//   useEffect(() => {
//     dispatch(fetchPatients({ page: null, limit: 50 }));
//   }, [dispatch]);

//   const calculateAge = (dob) => {
//     if (!dob) return "N/A";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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

//   const handleBedClick = () => {
//     if (bed.status !== "booked") {
//       setShowModal(true);
//       onClick(bed);
//     }
//   };

//   const handlePatientSelect = (patient) => {
//     const userData = {
//       bedStatus: "booked",
//       bedId: bed._id,
//       patientId: patient._id,
//     };

//     dispatch(bookBed({ bedId: bed._id, userData })).then(() => {
//       dispatch(fetchAllBookedBeds());
//     });
//     setShowModal(false);
//   };

//   return (
//     <div className="relative">
//       {/* Bed card */}
//       <div
//         className={`w-28 h-32 border rounded-lg transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer
//           ${bed.status === "booked" ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-200"}`}
//         onClick={handleBedClick}
//       >
//         <div className="flex flex-col h-full p-1.5">
//           <div className="flex items-center justify-between mb-1">
//             <BedIcon
//               className={`${bed.status === "booked" ? "text-red-500" : "text-blue-500"}`}
//               size={12}
//             />
//             <span
//               className={`font-bold text-xs ${
//                 bed.status === "booked" ? "text-red-600" : "text-blue-500"
//               }`}
//             >
//               #{bed.number}
//             </span>
//           </div>

//           <div className="flex justify-center mb-1">
//             <span
//               className={`text-[10px] font-semibold px-1 py-0.5 rounded-full tracking-wide ${
//                 bed.status === "booked"
//                   ? "text-red-700 bg-red-200 border border-red-300"
//                   : "text-green-700 bg-green-200 border border-green-300"
//               }`}
//             >
//               {bed.status === "booked" ? "BOOKED" : "AVAILABLE"}
//             </span>
//           </div>

//           {bed.status === "booked" && bed.patient ? (
//             <div className="bg-white rounded-md p-1 shadow-sm border border-red-100 text-xs flex flex-col flex-grow">
//               <p className="font-bold text-red-700 text-center truncate text-[10px]">
//                 {bed.patient.firstName} {bed.patient.lastName}
//               </p>
//               <div className="flex justify-center pt-1 pb-1 ">
//                 <span className="text-[10px] text-gray-500">Age:</span>
//                 <span className="font-bold text-gray-600 px-1 text-[10px]">
//                   {bed.patient.age || (bed.patient.dob ? calculateAge(bed.patient.dob) : "-")}
//                 </span>
//               </div>
//               <div className="flex items-center justify-center bg-red-50 rounded-md p-0.5 ">
//                 <Phone size={8} className="text-red-600 mr-0.5 " />
//                 <span className="font-mono text-[10px] text-red-700 truncate ">
//                   {bed.patient.phone?.mobile ||
//                   (bed.patient.phone?.dialCode && bed.patient.phone?.value
//                     ? `${bed.patient.phone.dialCode}${bed.patient.phone.value}`
//                     : bed.patient.phoneNumber
//                     ? typeof bed.patient.phoneNumber === "object"
//                       ? `${bed.patient.phoneNumber.dialCode} ${bed.patient.phoneNumber.value}`
//                       : bed.patient.phoneNumber
//                     : "-")}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center flex-grow">
//               <span className="text-xl mb-2">🛏️</span>
//               <p className="text-blue-700 font-medium text-[12px]">Ready for patient</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <h2 className="text-lg font-bold mb-3">Assign Patient</h2>

//         {/* Search input */}
//         <div className="relative mb-3">
//           <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search patient..."
//             className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Patient List */}
//         <div className="max-h-60 overflow-y-auto border rounded-lg">
//           {filteredPatients.length > 0 ? (
//             filteredPatients.map((patient) => (
//               <button
//                 key={patient._id}
//                 className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex flex-col border-b last:border-none"
//                 onClick={() => handlePatientSelect(patient)}
//               >
//                 <div className="font-medium text-gray-800">
//                   {patient.firstName} {patient.lastName}
//                 </div>
//                 <div className="flex items-center text-xs text-gray-600 gap-1">
//                   <Phone size={12} />{" "}
//                   {typeof patient.phoneNumber === "object"
//                     ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
//                     : patient.phoneNumber}
//                 </div>
//                 <div className="flex items-center text-xs text-gray-600 gap-1">
//                   <Calendar size={12} /> Age: {getAgeDisplay(patient.dob)}
//                 </div>
//               </button>
//             ))
//           ) : (
//             <p className="text-xs text-gray-400 text-center py-2">No results found</p>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default WardBed;

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { bookBed, fetchAllBookedBeds, updateBed, updateBookedBed,fetchBeds } from "../../Store/wardSlice";
import { fetchPatients } from "../../Store/patientSlice";
import { Bed as BedIcon, Search, Phone, Calendar } from "lucide-react";
import Swal from "sweetalert2";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const WardBed = ({ bed, onClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
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

  const handleBedClick = async (bedId) => {
    if (bed.status !== "booked") {
      setShowModal(true);
      onClick(bed);
    } else {
      const result = await Swal.fire({
        title: "Release Bed?",
        text: `Do you want to release Bed #${bed.number}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#64C6B0",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Release",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        try {
          await dispatch(
            updateBookedBed({
              bookedBedId: bedId,
              updates: { bedStatus: "discharged" },
            })
          ).unwrap();

          await dispatch(
            updateBed({
              id: bedId,
              updates: { status: "available"},
            })
          ).unwrap();

          await dispatch(fetchAllBookedBeds());
          await dispatch(fetchBeds({wardId:bed.wardId, currentPage:null, itemsPerPage:null, sortBy:null, order:null}));

          await Swal.fire({
            title: "Success!",
            text: "Bed has been released.",
            icon: "success",
            confirmButtonColor: "#64C6B0",
          });
        } catch (error) {
          await Swal.fire(
            "Error!",
            "Failed to release bed. Please try again.",
            "error"
          );
        }
      }
    }
  };

  const handlePatientSelect = async (patient) => {
    const result = await Swal.fire({
      title: "Confirm Bed Booking",
      text: `Do you want to assign ${patient.firstName} ${patient.lastName} to Bed #${bed.number}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#64C6B0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Book",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const userData = {
        bedStatus: "booked",
        bedId: bed._id,
        patientId: patient._id,
      };

      try {
        await dispatch(bookBed({ bedId: bed._id, userData })).unwrap();
        await dispatch(fetchAllBookedBeds());
        await dispatch(fetchBeds({ wardId: bed.wardId, currentPage: 1, itemsPerPage: 10, sortBy: "number", order: "asc" }));

        await Swal.fire({
          title: "Success!",
          text: "Bed has been successfully booked.",
          icon: "success",
          confirmButtonColor: "#64C6B0",
        });

        setShowModal(false);
      } catch (error) {
        await Swal.fire("Error!", "Failed to book the bed. Please try again.", "error");
      }
    }
  };
  return (
    <div className="relative">
      <div
        className={`w-28 h-36 border rounded-lg transition-all duration-200 relative shadow-sm hover:shadow-md cursor-pointer
          ${bed.status === "booked" ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-200"}`}
        onClick={() => handleBedClick(bed._id)}

      >
        <div className="flex flex-col h-full p-1.5">
          <div className="flex items-center justify-between mb-1">
            <BedIcon
              className={`${bed.status === "booked" ? "text-red-500" : "text-blue-500"}`}
              size={12}
            />
            <span
              className={`font-bold text-xs ${
                bed.status === "booked" ? "text-red-600" : "text-blue-500"
              }`}
            >
              #{bed.number}
            </span>
          </div>

          <div className="flex justify-center mb-1">
            <span
              className={`text-[10px] font-semibold px-1 py-0.5 rounded-full tracking-wide ${
                bed.status === "booked"
                  ? "text-red-700 bg-red-200 border border-red-300"
                  : "text-green-700 bg-green-200 border border-green-300"
              }`}
            >
              {bed.status === "booked" ? "BOOKED" : "AVAILABLE"}
            </span>
          </div>

          <div className="flex justify-center mb-1">
          <span className="text-[11px] font-bold text-gray-800">
            ₹{bed.bedPrice?.toLocaleString() || "0"}
          </span>
        </div>

          {bed.status === "booked" && bed.patient ? (
            <div className="bg-white rounded-md p-1 shadow-sm border border-red-100 text-xs flex flex-col flex-grow">
              <p className="font-bold text-red-700 text-center truncate text-[10px]">
                {bed.patient.firstName} {bed.patient.lastName}
              </p>
              <div className="flex justify-center pt-1 pb-1 ">
                <span className="text-[10px] text-gray-500">Age:</span>
                <span className="font-bold text-gray-600 px-1 text-[10px]">
                  {bed.patient.age || (bed.patient.dob ? calculateAge(bed.patient.dob) : "-")}
                </span>
              </div>
              <div className="flex items-center justify-center bg-red-50 rounded-md p-0.5 ">
                <Phone size={8} className="text-red-600 mr-0.5 " />
                <span className="font-mono text-[10px] text-red-700 truncate ">
                  {bed.patient.phone?.mobile ||
                  (bed.patient.phone?.dialCode && bed.patient.phone?.value
                    ? `${bed.patient.phone.dialCode}${bed.patient.phone.value}`
                    : bed.patient.phoneNumber
                    ? typeof bed.patient.phoneNumber === "object"
                      ? `${bed.patient.phoneNumber.dialCode} ${bed.patient.phoneNumber.value}`
                      : bed.patient.phoneNumber
                    : "-")}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow">
              <span className="text-xl mb-2">🛏️</span>
              <p className="text-blue-700 font-medium text-[12px]">Ready for patient</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-bold mb-4">Assign Patient</h2>

        <div className="relative mb-5">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient..."
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pr-1">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => handlePatientSelect(patient)}
                className="cursor-pointer rounded-xl border bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 p-4 flex flex-col gap-2"
              >
                <div className="text-base font-semibold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </div>

                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  Age: <span className="font-medium">{getAgeDisplay(patient.dob)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  DOB:{" "}
                  <span className="font-medium">
                    {new Date(patient.dob).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {typeof patient.phoneNumber === "object"
                      ? `${patient.phoneNumber.dialCode} ${patient.phoneNumber.value}`
                      : patient.phoneNumber}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-3 col-span-2">
              No results found
            </p>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default WardBed;
