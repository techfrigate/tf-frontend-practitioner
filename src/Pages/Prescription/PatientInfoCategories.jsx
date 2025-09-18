 
import React, { useState, useEffect } from "react";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import { useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScrollArea } from "../../Components/ui/scroll-area";
import GlobalSheet from "../../Components/Common/GlobalSheet";
import VideoConsultation from "./VideoConsultation";

const PatientInfoCategories = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const location = useLocation();
  const status = location.state?.status;
  const [searchParams] = useSearchParams();
  const channelName =  searchParams.get('channelName')
 
  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    setIsFormSheetOpen(true);
  };

  const closeSheet = () => {
    setIsFormSheetOpen(false);
  };

  return (
    <div className="h-full w-full overflow-hidden relative">
    {channelName && <VideoConsultation channelName={channelName} isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen}/>}
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
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${category.backgroundImage})`,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 to-[#3B82F6]/70 rounded-md"></div>
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