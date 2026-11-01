import React, { createContext, useCallback, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const MeetingContext = createContext(undefined);

export const MeetingProvider = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  const [call, setCall] = useState(null); // { appointmentId, channelName, guest }

  const startCall = useCallback((next) => {
    setCall((current) => {
      if (current && current.appointmentId !== next.appointmentId) {
        toast.error('Leave your current video call before starting another.');
        return current;
      }
      return current || next;
    });
    setIsMinimized(false);
  }, []);
  const endCall = useCallback(() => {
    setCall(null);
    setIsMinimized(false);
    setInMeeting(false);
  }, []);

  return (
    <MeetingContext.Provider value={{ isMinimized, setIsMinimized, inMeeting, setInMeeting, call, startCall, endCall }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
