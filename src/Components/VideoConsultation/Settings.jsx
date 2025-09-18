import React from 'react';
import { Settings as SettingsIcon, Video, Mic, Volume2 } from 'lucide-react';

export const Settings = ({
  isOpen,
  onClose,
  onDeviceChange,
  audioInputDevices,
  audioOutputDevices,
  videoDevices,
}) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col">
 
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            ×
          </button>
        </div>       
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
        
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Video className="h-5 w-5" />
                <h3 className="font-medium">Video</h3>
              </div>
              <select
                onChange={(e) => onDeviceChange('video', e.target.value)}
                className="w-full rounded-md border p-2"
              >
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Unknown Video Device'}
                  </option>
                ))}
              </select>
            </div>   
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <h3 className="font-medium">Microphone</h3>
              </div>
              <select
                onChange={(e) => onDeviceChange('audioInput', e.target.value)}
                className="w-full rounded-md border p-2"
              >
                {audioInputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Unknown Microphone'}
                  </option>
                ))}
              </select>
            </div>

     
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <h3 className="font-medium">Speakers</h3>
              </div>
              <select
                onChange={(e) => onDeviceChange('audioOutput', e.target.value)}
                className="w-full rounded-md border p-2"
              >
                {audioOutputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Unknown Speaker'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
