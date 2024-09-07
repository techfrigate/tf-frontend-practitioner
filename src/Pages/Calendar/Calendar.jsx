import React, { useEffect, useState } from 'react'
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
import styles from "../../Css/roster/roster.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { getRosters } from '../../Store/rosterSlice';
const Calendar = () => {
  const [rosterData, setRosterData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onPopupOpen = (args) => {
    args.cancel = true;
  };
  const {profileData} =  useSelector((state)=> state.profile)

  const dispatch =  useDispatch();
console.log(profileData);
  useEffect(()=>{
    if(profileData){
      dispatch(getRosters(profileData._id))
    }
    
  },[profileData])
 



  const { rostersData } = useSelector((state) => state.rosters);

  useEffect(() => {
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
  }, [rostersData]);

  const onDragStop = (args) => {
    args.cancel = true;
  };

  return (
    <div className="rounded-xl overflow-hidden h-full shadow-md border border-gray-300">
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
      </div>
  )
}

export default Calendar