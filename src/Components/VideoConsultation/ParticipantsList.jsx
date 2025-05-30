import React from 'react';
import { Users } from 'lucide-react';

export const ParticipantsList = ({ isOpen, onClose, participants }) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Participants</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {participants.map((participant) => (
            <div
              key={participant.uid}
              className="mb-3 flex items-center justify-between rounded-lg bg-gray-100 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                  {participant.name[0].toUpperCase()}
                </div>
                <span className="font-medium">{participant.name}</span>
              </div>
              <div className="flex gap-2">
                {participant.isAudioMuted && (
                  <span className="text-red-500" title="Audio Muted">
                    🎤
                  </span>
                )}
                {participant.isVideoMuted && (
                  <span className="text-red-500" title="Video Off">
                    📷
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
