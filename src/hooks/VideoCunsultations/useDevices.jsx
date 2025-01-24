import { useState, useEffect } from 'react';

export const useDevices = () => {
  const [devices, setDevices] = useState({
    audioInput: [],
    audioOutput: [],
    video: [],
  });

  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        audioInput: devices.filter((device) => device.kind === 'audioinput'),
        audioOutput: devices.filter((device) => device.kind === 'audiooutput'),
        video: devices.filter((device) => device.kind === 'videoinput'),
      });
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  useEffect(() => {
    loadDevices();
    navigator.mediaDevices.addEventListener('devicechange', loadDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
    };
  }, []);

  return devices;
};
