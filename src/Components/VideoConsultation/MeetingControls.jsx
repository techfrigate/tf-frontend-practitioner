import React from 'react';
import {Mic,MicOff,Video,VideoOff,Monitor,MonitorOff,MessageCircle,Users,PhoneOff,Minimize2,Settings, ClipboardPenLine, ClipboardPen} from 'lucide-react';

export const MeetingControls = ({currentPatientId,isAudioMuted,isVideoMuted,isScreenSharing,onAudioToggle,onVideoToggle,onScreenShare,onChatToggle,onParticipantsToggle,onLeave,onMinimize,onSettingsToggle,
  isSheetOpen,setIsSheetOpen}) => {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between">
      <div className="flex gap-4">
        <button
          onClick={onAudioToggle}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isAudioMuted
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={isAudioMuted ? 'Unmute' : 'Mute'}
        >
          {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button
          onClick={onVideoToggle}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isVideoMuted
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={isVideoMuted ? 'Start Video' : 'Stop Video'}
        >
          {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
        <button
          onClick={onScreenShare}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isScreenSharing
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        >
          {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </button>
              <button
          onClick={()=>setIsSheetOpen(!isSheetOpen)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isSheetOpen
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={'Write Prescription'}
        >
          {isSheetOpen ? <ClipboardPen size={20} /> :<ClipboardPenLine size={20} />}
        </button>
         
      </div>
      <div className="flex gap-4">
        <button
          onClick={onChatToggle}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300"
          title="Chat"
        >
          <MessageCircle size={20} />
        </button>
        <button
          onClick={onParticipantsToggle}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300"
          title="Participants"
        >
          <Users size={20} />
        </button>

        <button
          onClick={onMinimize}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300"
          title="Minimize"
        >
          <Minimize2 size={20} />
        </button>
        <button
          onClick={onSettingsToggle}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          title="Leave Meeting"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};
