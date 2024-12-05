import React, { useState, useEffect } from "react";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScrollArea } from "../../components/ui/scroll-area";
import GlobalSheet from "../../components/Common/GlobalSheet";

const PatientInfoCategories = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const location = useLocation();
  const status = location.state?.status;
  const allergies = useSelector((state) => state.formData.Allergies);
  console.log("allergies", allergies)
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
        label={`Patient Information Categories`}
        triggerText=""
        buttonClassName="hidden"
      >
        <div>
          <div
            className={`bg-${
              status === "Checked In"
                ? "green-100"
                : status === "Closed"
                ? "red-100"
                : "blue-100"
            } text-${
              status === "Checked In"
                ? "green-800"
                : status === "Closed"
                ? "red-800"
                : "blue-800"
            } px-4 py-3 rounded-lg shadow-sm mb-4`}
          >
            <p className="text-base font-semibold">
              <strong>Patient Status:</strong> {status || "Not Available"}
            </p>
            <p className="text-sm mt-1">
              {status ? (
                <>
                  <span>
                    The patient is currently <strong>"{status}"</strong>.{" "}
                    {status === "Scheduled" &&
                      "The appointment is upcoming. Once the patient is checked in, you’ll be able to access and fill in the relevant forms."}
                    {status === "Checked In" &&
                      "You may now proceed to fill out the necessary forms in the categories below."}
                    {status === "Checked Out" &&
                      "The patient has completed their visit. Forms are locked for updates; please review notes or final documentation as needed."}
                    {status === "Closed" &&
                      "All actions are completed for this patient. Forms are locked; please review final notes or archive the record as appropriate."}
                  </span>
                  <p className="text-xs text-gray-600 mt-2">
                    {status === "Checked In"
                      ? "Please select a category below to access and complete the patient's intake forms."
                      : "Form access is restricted to the 'Checked In' status."}
                  </p>
                </>
              ) : (
                "No status set. Please check the patient's record for more information or set an appropriate status to proceed."
              )}
            </p>
          </div>

          {status === "Checked In" && (
            <ScrollArea className={`h-[470px]`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto p-5">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`relative bg-gradient-to-r ${category.gradient} shadow-md rounded-xl p-3 hover:shadow-lg transition-transform transform hover:scale-105 group cursor-pointer`}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <div>{category.icon}</div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      {category.description}
                    </p>

                    <button
                      onClick={() => handleButtonClick(category)}
                      className="hidden group-hover:inline-block px-3 py-2 text-xs font-semibold text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-100 transition"
                    >
                      Fill Details
                    </button>
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
