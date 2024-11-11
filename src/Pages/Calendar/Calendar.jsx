

import React, { useEffect, useState } from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import styles from "../../Css/roster/roster.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRosters } from "../../Store/rosterSlice";
import Loading from "../../Components/Common/Loading";

const Calendar = () => {
  const [rosterData, setRosterData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => state.profile);
  const { rostersData, rosterStatus, error } = useSelector(
    (state) => state.rosters
  ); // Access rosterStatus

  const onPopupOpen = (args) => {
    args.cancel = true;
  };

  useEffect(() => {
    if (profileData) {
      dispatch(getRosters(profileData._id)); // Fetch roster data when profileData changes
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    // Transform the fetched roster data for the calendar
    if (rostersData) {
      const newEvents = rostersData?.map((roster, rosterIndex) => {
        const startTime = new Date(roster.startDate);
        const endTime = new Date(roster.endDate);
        return {
          Id: rostersData.length + 1 + rosterIndex,
          rosterId: roster._id,
          Subject: `Appointment with ${roster.practitionerData.firstName} ${roster.practitionerData.lastName}`,
          StartTime: startTime,
          EndTime: endTime,
          CategoryColor: "#64C6B0",
          Description: `Visit Type: ${roster.visitType}`,
        };
      });

      setRosterData(() => newEvents);
    }
  }, [rostersData]);

  const onDragStop = (args) => {
    args.cancel = true;
  };

  return (
    <div className="rounded-xl overflow-hidden h-full shadow-md border border-gray-300">
      {rosterStatus === "loading" ? (
        <Loading size="16" color="teal-500" className="h-screen" /> // Show loading spinner when status is loading
      ) : rosterStatus === "failed" ? (
        <div className="text-center text-red-500">
          {error || "Error loading roster data"}
        </div> // Show error message if the fetch failed
      ) : (
        <ScheduleComponent
          height="100%"
          selectedDate={selectedDate}
          eventSettings={{ dataSource: rosterData }}
          currentView="Month"
          timezone="UTC"
          popupOpen={onPopupOpen}
          dragStop={onDragStop}
          cssClass={styles.custom_schedule}
        >
          <Inject
            services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
          />
        </ScheduleComponent>
      )}
    </div>
  );
};

export default Calendar;
