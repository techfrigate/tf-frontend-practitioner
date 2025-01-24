import React, { useEffect, useState } from 'react';
import { Maximize2, MicOff, VideoOff } from 'lucide-react';

export const MinimizedMeeting = ({channelName,isAudioMuted,isVideoMuted,onMaximize,className}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(()=>{
    const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const boxWidth = 600;  
const boxHeight = 342;  
setPosition({
  x: windowWidth - boxWidth - 60,  
  y: (windowHeight - boxHeight) / 2,  
});


  },[])
  const handleMouseMove = (e) => {
    if (!dragging) return;
  
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
 
    const maxWidth = window.innerWidth - 600;  
    const maxHeight = window.innerHeight - 340; 
  
    setPosition({
      x: Math.max(0, Math.min(newX, maxWidth)),
      y: Math.max(0, Math.min(newY, maxHeight)),
    });
  };
  

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: 50,
      }}
      className={`flex h-48 w-80 flex-col overflow-hidden rounded-lg bg-white shadow-lg ${
        className || ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}  
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 p-2 text-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Meeting: {channelName}</span>
          <div className="flex gap-1">
            {isAudioMuted && <MicOff size={14} className="text-red-500" />}
            {isVideoMuted && <VideoOff size={14} className="text-red-500" />}
          </div>
        </div>
        <button
          onClick={onMaximize}
          className="rounded p-1 hover:bg-white/20"
          title="Maximize"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Video Placeholder */}
      <div className="relative flex-1 bg-gray-900">
        <div id="minimized-video" className="h-full w-full">
          {/* Video will be rendered here */}
        </div>
      </div>
    </div>
  );
};
