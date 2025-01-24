import React, { useEffect, useState } from "react";
import { ScrollArea } from "../../Components/ui/scroll-area";
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "../../Components/ui/tabs";
import { StethoscopeIcon, TableIcon, Video } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {getPrescriptions,updateAppointment} from "../../../src/Store/appointmentSlice";
import PatientTableContent from "./PatientTableContent";
import { showErrorToast } from "../../Components/toastUtils";
import VideoConsultation from "./VideoConsultation";
import GlobalSheet from "../../Components/Common/GlobalSheet";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import PatientColumn from "../../Components/Prescription/PatientColumn";
import { allowedTransitions, initialStatuses, statusColors } from "../../util/patientUtil";

 
function PatientDetails() {
  const [channelName, setChannelName] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [status, setStatus] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const dispatch = useDispatch();
  
  const { prescriptionData } = useSelector((state) => state.appointment);
  const { profileData } = useSelector((state) => state.profile);
  useEffect(() => {
    dispatch(getPrescriptions({ practitionerId: profileData?._id }));
  }, [dispatch]);

  useEffect(() => {
    const filtered = {
      Scheduled: [],
      "Checked In": [],
      "Checked Out": [],
      Closed: [],
    };


    prescriptionData.forEach((patient) => {
      const { bookingStatus } = patient;

      if (bookingStatus.closed) {
        filtered.Closed.push(patient);
      } else if (bookingStatus.checkOut) {
        filtered["Checked Out"].push(patient);
      } else if (bookingStatus.checkIn) {
        filtered["Checked In"].push(patient);
      } else if (bookingStatus.booked) {
        filtered.Scheduled.push(patient);
      }
    });

    setFilteredData(filtered);
  }, [prescriptionData]);
 
  const onTaskDrop = (event, newStatus) => {
    event.preventDefault();
    const patientId = event.dataTransfer.getData("text/plain");
    const patient = prescriptionData.find((item) => item._id === patientId);

    if (patient) {
      const { bookingStatus } = patient;
      let currentStatusKey;
      if (bookingStatus.closed) {
        currentStatusKey = "Closed";
      } else if (bookingStatus.checkOut) {
        currentStatusKey = "Checked Out";
      } else if (bookingStatus.checkIn) {
        currentStatusKey = "Checked In";
      } else if (bookingStatus.booked) {
        currentStatusKey = "Scheduled";
      }

      if (!allowedTransitions[currentStatusKey]?.includes(newStatus)) {
        showErrorToast(
          `Can't change status from ${currentStatusKey} to ${newStatus} for Swetarani Patel.`
        );
        return;
      }

      const isDuplicate = filteredData[newStatus]?.some(
        (p) => p._id === patientId
      );

      if (isDuplicate) {
        showErrorToast(
          `Patient with ID ${patientId} already exists in the ${newStatus} section.`
        );
        return;
      }

      let updatedStatusKey;
      if (newStatus === "Scheduled") {
        updatedStatusKey = "booked";
      } else if (newStatus === "Checked In") {
        updatedStatusKey = "checkIn";
      } else if (newStatus === "Checked Out") {
        updatedStatusKey = "checkOut";
      } else if (newStatus === "Closed") {
        updatedStatusKey = "closed";
      }

      const updatedStatus = {
        ...bookingStatus,
        [updatedStatusKey]: new Date(),
      };

      const body = { bookingStatus: updatedStatus };
      dispatch(updateAppointment({ _id: patientId, body }));

      setFilteredData((prev) => {
        const updatedData = { ...prev };
        updatedData[currentStatusKey] = updatedData[currentStatusKey].filter(
          (p) => p._id !== patientId
        );
        updatedData[newStatus] = [...(updatedData[newStatus] || []), patient];

        return updatedData;
      });
    } else {
      console.error("Patient not found in prescriptionData");
    }
  };


  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    setIsFormSheetOpen(true);
  };

  const closeSheet = () => {
    setIsFormSheetOpen(false);
  };

  return (
    <div className={`h-full w-full overflow-y-auto custom-scrollbar p-1 relative`}>
    <div>
    <Tabs defaultValue="Patient Details">
        <TabsList>
          <TabsTrigger value="Patient Details">
            <StethoscopeIcon className="w-5 h-5" />
            <span className="ml-2">Patient Details</span>
          </TabsTrigger>
          <TabsTrigger value="Table">
            <TableIcon className="w-5 h-5" />
            <span className="ml-2">Table</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Patient Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
            {initialStatuses.map((status) => (
              <div
                key={status.display}
                className="bg-white p-5 pb-20 rounded-xl shadow-lg border border-gray-200 h-[570px] overflow-hidden custom-scrollbar"
              >
                <div
                  className={`flex justify-between items-center mb-4 p-2 rounded-lg ${
                    statusColors[status.display]
                  }`}
                >
                  <h2 className="text-sm font-semibold">{status.display}</h2>
                </div>
                <ScrollArea className={`h-full`}>
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onTaskDrop(event, status.display)}
                    className="p-2 bg-gray-50 rounded-lg shadow-inner h-[570px]"
                  >
 
                    {filteredData[status.display]?.map((patient) => 
                     <PatientColumn patient={patient} setChannelName={setChannelName} setStatus={setStatus}/>
                     )}
 
                  </div>
                </ScrollArea>
              </div>
              
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Table">
          <PatientTableContent patients={prescriptionData} />
        </TabsContent>
      </Tabs>
    </div>
    

       
       {channelName && 
        <VideoConsultation channelName={channelName} setChannelName={setChannelName} isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen}/>
        }
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
}

export default PatientDetails;
