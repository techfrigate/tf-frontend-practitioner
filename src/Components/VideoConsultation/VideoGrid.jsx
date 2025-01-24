import React from 'react';
import { Pin, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export const VideoGrid = ({ participants, onPinParticipant }) => {
  const pinnedParticipant = participants.find((p) => p.isPinned);
  const unpinnedParticipants = participants.filter((p) => !p.isPinned);

  return (
    <div className="h-full w-full">
      {pinnedParticipant ? (
        <div className="grid h-full grid-cols-4 gap-4">
          <div className="col-span-3 row-span-full">
            <div id={`player-${pinnedParticipant.uid}`} className="h-full w-full rounded-lg bg-gray-800" />
          </div>
          <div className="col-span-1 grid auto-rows-fr gap-4">
            {unpinnedParticipants.map((participant) => (
              <VideoParticipant
                key={participant.uid}
                participant={participant}
                onPin={onPinParticipant}
                small
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="grid h-full gap-4 auto-rows-fr"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${
              participants.length > 1 ? '400px' : '100%'
            }, 1fr))`,
          }}
        >
          {participants.map((participant) => (
            <VideoParticipant
              key={participant.uid}
              participant={participant}
              onPin={onPinParticipant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VideoParticipant = ({ participant, onPin, small }) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-gray-800 ${
        small ? 'h-48' : 'h-full'
      }`}
    >
      <div id={`player-${participant.uid}`} className="h-full w-full" />
      
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="text-white">{participant.name}</span>
          {participant.isAudioMuted ? (
            <MicOff size={16} className="text-red-500" />
          ) : (
            <Mic size={16} className="text-white" />
          )}
          {participant.isVideoMuted ? (
            <VideoOff size={16} className="text-red-500" />
          ) : (
            <Video size={16} className="text-white" />
          )}
        </div>
        
        <button
          onClick={() => onPin(participant.uid)}
          className="rounded-full p-1 text-white hover:bg-white/20"
          title={participant.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={16} className={participant.isPinned ? 'text-blue-500' : ''} />
        </button>
      </div>
    </div>
  );
};
