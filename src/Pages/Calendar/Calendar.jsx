import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRosters } from "../../Store/rosterSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Components/ui/dialog";
import Loader from "../../Components/Common/Loader";

const renderEventContent = (eventInfo) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="px-1 py-1 rounded-sm overflow-hidden text-[0.90em] cursor-pointer"
          style={{
            backgroundColor: eventInfo.event.backgroundColor,
            color: eventInfo.event.textColor,
            lineHeight: "1.2",
          }}
        >
          <div>{eventInfo.timeText}</div>
          <div>{eventInfo.event.title}</div>
        </div>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle> {eventInfo.event.title}</DialogTitle>
          <DialogDescription>
            View the full prescription details here.
          </DialogDescription>
        </DialogHeader>
        <div>
      <p className="text-sm text-gray-700 mb-2 font-semibold">Time: {eventInfo.timeText}</p>
      <p className="text-sm text-gray-600 mb-4 font-semibold"> {eventInfo.event.extendedProps.description || "No description available."}</p>
    </div>
      </DialogContent>
    </Dialog>
  );
};

const colors = ["#64C6B0", "#FFB6C1", "#FFD700", "#87CEFA", "#FF6347"];

const Calendar = () => {
  const [rosterData, setRosterData] = useState([]);
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
        const color = colors[index % colors.length];
        return {
          id: roster._id,
          title: `Appointment with Dr. ${profileData?.firstName} ${profileData?.lastName}`,
          start: startTime,
          end: endTime,
          backgroundColor: color,
          borderColor: color,
          textColor: "#fff",
          display: "block",
          extendedProps: {
            description: `Visit Type: ${roster.visitType}`,
          },
        };
      });

      setRosterData(() => newEvents);
    }// eslint-disable-next-line
  }, [rostersData]);

  return (
    <div className="rounded-md customScrollbar h-full  shadow-md border border-gray-300 p-2">
      {rosterStatus === "loading" ? (
        <Loader />
      ) : rosterStatus === "failed" ? (
        <div className="text-center text-red-500">
          {error || "Error loading roster data"}
        </div>
      ) : (
        <FullCalendar
          timeZone="UTC"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
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
             // eslint-disable-next-line
            meridiem: (date) => date.toUpperCase(),
          }}
          events={rosterData}
          editable={true}
          selectable={true}
          selectMirror={true}
          height="100%"
          themeSystem="bootstrap5"
          eventContent={renderEventContent}
          dayMaxEventRows={false}
          eventDisplay="block"
        />
      )}
    </div>
  );
};

export default Calendar;
