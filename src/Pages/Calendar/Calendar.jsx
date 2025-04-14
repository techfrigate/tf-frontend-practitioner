import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRosters } from "../../Store/rosterSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,DialogFooter,} from "../../Components/ui/dialog";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { Clock, Calendar as CalendarIcon,  User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../Components/Common/Loader";

const renderEventContent = (eventInfo) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="px-2 py-1.5 rounded-md overflow-hidden text-[0.90em] cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-md flex flex-col"
          style={{
            backgroundColor: eventInfo.event.backgroundColor,
            color: eventInfo.event.textColor,
            lineHeight: "1.3",
          }}
        >
          <div className="font-medium">{eventInfo.timeText}</div>
          <div className="font-semibold truncate">{eventInfo.event.title}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> 
            {eventInfo.event.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            View your appointment details below
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Appointment Time</p>
              <p className="text-gray-600">{eventInfo.timeText}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Visit Details</p>
              <p className="text-gray-600">{eventInfo.event.extendedProps.description || "No description available."}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Doctor</p>
              <p className="text-gray-600">{eventInfo.event.extendedProps.doctorName}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {eventInfo.event.extendedProps.status || "Scheduled"}
          </Badge>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const colorPalette = [
  { bg: "#4F46E5", text: "#ffffff" }, 
  { bg: "#0EA5E9", text: "#ffffff" },
  { bg: "#10B981", text: "#ffffff" }, 
  { bg: "#F59E0B", text: "#ffffff" }, 
  { bg: "#EC4899", text: "#ffffff" },
  { bg: "#8B5CF6", text: "#ffffff" }, 
];

const Calendar = () => {
  const [rosterData, setRosterData] = useState([]);
  const [viewMode, setViewMode] = useState("dayGridMonth");
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => state.profile);
  const { rostersData, rosterStatus, error } = useSelector(
    (state) => state.rosters
  );

  useEffect(() => {
    if (profileData) {
      dispatch(getRosters(profileData._id));
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    if (rostersData) {
      const newEvents = rostersData?.map((roster, index) => {
        const startTime = new Date(roster.startDate);
        const endTime = new Date(roster.endDate);
        const colorSet = colorPalette[index % colorPalette.length];
        
        return {
          id: roster._id,
          title: `Appointment with Dr. ${profileData?.lastName}`,
          start: startTime,
          end: endTime,
          backgroundColor: colorSet.bg,
          borderColor: colorSet.bg,
          textColor: colorSet.text,
          display: "block",
          extendedProps: {
            description: `Visit Type: ${roster.visitType}`,
            status: roster.status || "Confirmed",
            doctorName: `${profileData?.firstName} ${profileData?.lastName}`,
            visitType: roster.visitType
          },
        };
      });

      setRosterData(newEvents);
    }
  }, [rostersData, profileData]);

  const handleViewChange = (newView) => {
    setViewMode(newView);
  };

  return (
    <div className="rounded-md customScrollbar h-full shadow-lg border border-gray-300 bg-white flex flex-col">
      {/* //  <div className="rounded-md customScrollbar h-full  shadow-md border border-gray-300 p-2"> */}
      
      <div className="flex-grow p-4 overflow-auto">
    
        <AnimatePresence mode="wait">
          {rosterStatus === "loading" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="loader"
            >
              <Loader />
            </motion.div>
          ) : rosterStatus === "failed" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="error"
              className="bg-red-50 text-red-600 p-8 rounded-lg border border-red-100 text-center"
            >
              <div className="inline-block p-3 rounded-full bg-red-100 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Unable to Load Calendar</h3>
              <p>{error || "There was an error loading your appointments. Please try again later."}</p>
              <Button className="mt-4" variant="outline" onClick={() => dispatch(getRosters(profileData?._id))}>
                Retry
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="calendar"
              className="h-full"
            >
              
              <FullCalendar
                timeZone="UTC"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                initialView={viewMode}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                buttonText={{
                  today: "Today",
                  month: "Month",
                  week: "Week",
                  day: "Day",
                  list: "List",
                }}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                  hour12: true,
                }}
                events={rosterData}
                editable={true}
                selectable={true}
                selectMirror={true}
                height="100%"
                themeSystem="standard"
                eventContent={renderEventContent}
                dayMaxEventRows={3}
                moreLinkClick="popover"
                moreLinkClassNames="font-medium text-primary hover:underline px-2 py-1"
                eventDisplay="block"
                viewDidMount={(info) => handleViewChange(info.view.type)}
                dayHeaderClassNames="text-gray-600 font-medium py-2"
                dayCellClassNames="hover:bg-gray-50 transition-colors"
                slotLabelClassNames="text-sm font-medium text-gray-500"
                eventClassNames="rounded-md overflow-hidden shadow-sm"
                slotLaneClassNames="border-gray-100"
                allDayClassNames="text-xs text-gray-500 font-medium"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {rosterStatus !== "loading" && rosterStatus !== "failed" && (
        <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <div>Total appointments: {rosterData.length}</div>
        </div>
      )}
    </div>
  );
};

export default Calendar;