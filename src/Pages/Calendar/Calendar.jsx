import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRosters } from "../../Store/rosterSlice";
import Loading from "../../components/Common/Loading";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
 

const renderEventContent = (eventInfo) => {
  return (
    <div className="px-1 py-0.5 rounded-sm overflow-hidden text-[0.90em]" style={{  backgroundColor: eventInfo.event.backgroundColor, color: eventInfo.event.textColor, lineHeight: '1.2'  }}>
      <div>{eventInfo.timeText}</div>
      <div>{eventInfo.event.title}</div>
    </div>
  );
};


const colors = ['#64C6B0', '#FFB6C1', '#FFD700', '#87CEFA', '#FF6347'];

const Calendar = () => {
  const [rosterData, setRosterData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => state.profile);
  const { rostersData, rosterStatus, error } = useSelector(
    (state) => state.rosters
  ); // Access rosterStatus

   

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
        console.log("Event start time:", startTime);  
        console.log("Event end time:", endTime);    
        const color = colors[index % colors.length];  
        return {
          id: roster._id,
          title: `Appointment with ${roster.practitionerData.firstName} ${roster.practitionerData.lastName}`,
          start: startTime,
          end: endTime,
          backgroundColor: color,
        borderColor: color,  
        textColor: '#fff', 
        display: 'block',
        extendedProps: {
          description: `Visit Type: ${roster.visitType}`,
        },
        };
      });

      setRosterData(() => newEvents);
    }
  }, [rostersData]);
  



  return (
    <div className="rounded-md customScrollbar h-full  shadow-md border border-gray-300 p-2">
      {rosterStatus === "loading" ? (
        <Loading size="16" color="teal-500" className="h-screen" />
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
              today: "today",
              month: "month",
              week: "week",
              day: "day",
              list: "list",
            }}
                eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short',  
        hour12: true,       
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
