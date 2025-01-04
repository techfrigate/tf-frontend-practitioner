// import React, { useState, useEffect } from "react";
// import categories from "./CategoriesData";
// import FillDetailsSheet from "./FillDetailsSheet";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { ScrollArea } from "../../Components/ui/scroll-area";
// import GlobalSheet from "../../Components/Common/GlobalSheet";

// const PatientInfoCategories = () => {
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
//   const location = useLocation();
//   const status = location.state?.status;
//   const allergies = useSelector((state) => state.formData.Allergies);
//   console.log("allergies", allergies);
//   useEffect(() => {
//     setIsSheetOpen(true);
//   }, []);

//   const handleButtonClick = (category) => {
//     setSelectedCategory(category);
//     setIsFormSheetOpen(true);
//   };

//   const closeSheet = () => {
//     setIsFormSheetOpen(false);
//   };

//   return (
//     <div>
//       <div className="p-5">
//         <h2 className="text-lg font-semibold mb-4">Table Content</h2>
//         <p>This is the main page table content displayed outside the sheet.</p>
//       </div>

//       <GlobalSheet
//         isDialogOpen={isSheetOpen}
//         setIsDialogOpen={setIsSheetOpen}
//         label={`Patient Information Categories`}
//         triggerText=""
//         buttonClassName="hidden"
//       >
//         <div>
//           <div
//             className={`bg-${
//               status === "Checked In"
//                 ? "green-100"
//                 : status === "Closed"
//                 ? "red-100"
//                 : "blue-100"
//             } text-${
//               status === "Checked In"
//                 ? "green-800"
//                 : status === "Closed"
//                 ? "red-800"
//                 : "blue-800"
//             } px-4 py-3 rounded-lg shadow-sm mb-4 m-5`}
//           >
//             <p className="text-sm font-semibold">
//               <strong>Patient Status:</strong> {status || "Not Available"}
//             </p>
//           </div>

//           {status === "Checked In" && (
//             <ScrollArea>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto px-5">
//                 {categories.map((category, index) => (
//                   <div
//                     key={index}
//                     className={`relative bg-gradient-to-r ${category.gradient} shadow-md rounded-xl p-3 hover:shadow-lg transition-transform transform hover:scale-105 group cursor-pointer`}
//                   >
//                     <div className="flex items-center space-x-2 mb-3">
//                       <div>{category.icon}</div>
//                       <h3 className="text-xs font-semibold text-gray-700">
//                         {category.name}
//                       </h3>
//                     </div>
//                     <div></div>
//                     <p className="text-xs text-gray-600 mb-4">
//                       {category.description}
//                     </p>
//                     <button
//                       onClick={() => handleButtonClick(category)}
//                       className="p-2 rounded-full bg-blue-600 text-white flex items-center justify-center w-7 h-7 transition-all duration-200 ease-in-out hover:bg-blue-700 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95"
//                     >
//                       &rarr;
//                     </button>
//                   </div>
//                 ))}

//                 {selectedCategory && (
//                   <FillDetailsSheet
//                     isDialogOpen={isFormSheetOpen}
//                     setIsDialogOpen={setIsFormSheetOpen}
//                     selectedCategory={selectedCategory}
//                     closeSheet={closeSheet}
//                   />
//                 )}
//               </div>
//             </ScrollArea>
//           )}
//         </div>
//       </GlobalSheet>
//     </div>
//   );
// };

// export default PatientInfoCategories;

import React, { useState, useEffect } from "react";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScrollArea } from "../../Components/ui/scroll-area";
import GlobalSheet from "../../Components/Common/GlobalSheet";

const PatientInfoCategories = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const location = useLocation();
  const status = location.state?.status;
  const allergies = useSelector((state) => state.formData.Allergies);
  console.log("allergies", allergies);
  useEffect(() => {
    setIsSheetOpen(true);
  }, []);

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    setIsFormSheetOpen(true);
  };

  const closeSheet = () => {
    setIsFormSheetOpen(false);
  };

  return (
    <div>
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-4">Table Content</h2>
        <p>This is the main page table content displayed outside the sheet.</p>
      </div>

      <GlobalSheet
        isDialogOpen={isSheetOpen}
        setIsDialogOpen={setIsSheetOpen}
        label={`Patient Status: ${status || "Not Available"}`}
        triggerText=""
        buttonClassName="hidden"
      >
        <div>
          {status === "Checked In" && (
            <ScrollArea className={`h-screen`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto px-5">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg shadow-lg overflow-hidden bg-gray-800"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${category.backgroundImage})`,
                      }}
                    ></div>

                    {/* Glassy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 to-[#3B82F6]/70 rounded-md"></div>

                    {/* Card Content */}
                    <div className="relative p-4 text-white z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center space-x-2">
                        <div>{category.icon}</div>
                        <h3 className="text-sm font-semibold ">
                          {" "}
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-xs mt-2">{category.description}</p>
                      <div className="flex justify-between">
                        <div></div>
                        <button
                          onClick={() => handleButtonClick(category)}
                          className="mt-1 bg-slate-300 text-blue-600 rounded-full shadow-lg flex items-center justify-center w-7 h-7"
                          aria-label={`Fill details for ${category.name}`}
                        >
                          &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedCategory && (
                  <FillDetailsSheet
                    isDialogOpen={isFormSheetOpen}
                    setIsDialogOpen={setIsFormSheetOpen}
                    selectedCategory={selectedCategory}
                    closeSheet={closeSheet}
                  />
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </GlobalSheet>
    </div>
  );
};

export default PatientInfoCategories;
