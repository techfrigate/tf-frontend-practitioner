import React, { createContext, useContext, useState } from 'react';

const MeetingContext = createContext(undefined);

export const MeetingProvider = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);

  return (
    <MeetingContext.Provider value={{ isMinimized, setIsMinimized, inMeeting, setInMeeting }}>
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
