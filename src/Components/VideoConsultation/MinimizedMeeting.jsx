import React, { useEffect, useState } from 'react';
import { Maximize2, MicOff, VideoOff, ClipboardPen, ClipboardPenLine } from 'lucide-react';

export const MinimizedMeeting = ({ 
  channelName, 
  isAudioMuted, 
  isVideoMuted, 
  onMaximize, 
  isSheetOpen, 
  setIsSheetOpen, 
  className 
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 320, height: 192 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const minSize = { width: 200, height: 150 };
  const maxSize = { width: 800, height: 600 };

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const boxWidth = size.width;
    const boxHeight = size.height;
    
    setPosition({
      x: (windowWidth - boxWidth) / 2, // Center horizontally
      y: (windowHeight - boxHeight) / 2, // Center vertically
    });
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e, handle) => {
    e.stopPropagation();
    setResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging && !resizing) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }

    if (resizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeHandle.includes('right')) {
        newWidth = resizeStart.width + deltaX;
      }
      if (resizeHandle.includes('left')) {
        newWidth = resizeStart.width - deltaX;
        newX = position.x + deltaX;
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = resizeStart.height + deltaY;
      }
      if (resizeHandle.includes('top')) {
        newHeight = resizeStart.height - deltaY;
        newY = position.y + deltaY;
      }

      // Apply constraints
      newWidth = Math.max(minSize.width, Math.min(newWidth, maxSize.width));
      newHeight = Math.max(minSize.height, Math.min(newHeight, maxSize.height));

      // Ensure it doesn't go outside window bounds
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > window.innerWidth) {
        newWidth = window.innerWidth - newX;
      }
      if (newY + newHeight > window.innerHeight) {
        newHeight = window.innerHeight - newY;
      }

      setSize({ width: newWidth, height: newHeight });
      
      if (resizeHandle.includes('left') || resizeHandle.includes('top')) {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setResizeHandle('');
  };

  useEffect(() => {
    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, resizing, dragOffset, resizeStart, position, size]);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: 50,
      }}
      className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-lg ${className || ''}`}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 p-2 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Meeting: {channelName}</span>
          <div className="flex gap-1">
            {isAudioMuted && <MicOff size={14} className="text-red-500" />}
            {isVideoMuted && <VideoOff size={14} className="text-red-500" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSheetOpen(!isSheetOpen)}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
              isSheetOpen
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            title="Write Prescription"
          >
            {isSheetOpen ? <ClipboardPen size={14} /> : <ClipboardPenLine size={14} />}
          </button>
          <button
            onClick={onMaximize}
            className="rounded p-1 hover:bg-white/20"
            title="Maximize"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative flex-1 bg-gray-900">
        <div id="minimized-video" className="h-full w-full">
          {/* Video will be rendered here */}
        </div>
      </div>

      {/* Resize Handles */}
      {/* Corner handles */}
      <div
        className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 cursor-nw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
      />
      <div
        className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 cursor-ne-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
      />
      <div
        className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 cursor-sw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
      />
      <div
        className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 cursor-se-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
      />

      {/* Edge handles */}
      <div
        className="resize-handle absolute -top-1 left-3 right-3 h-2 cursor-n-resize opacity-0 hover:opacity-50 hover:bg-blue-500"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
      />
      <div
        className="resize-handle absolute -bottom-1 left-3 right-3 h-2 cursor-s-resize opacity-0 hover:opacity-50 hover:bg-blue-500"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
      />
      <div
        className="resize-handle absolute -left-1 top-3 bottom-3 w-2 cursor-w-resize opacity-0 hover:opacity-50 hover:bg-blue-500"
        onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
      />
      <div
        className="resize-handle absolute -right-1 top-3 bottom-3 w-2 cursor-e-resize opacity-0 hover:opacity-50 hover:bg-blue-500"
        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
      />
    </div>
  );
};