import { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useAgoraControls = (client, localTracks, screenTrack, setIsScreenSharing,isScreenSharing) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const handleAudioToggle = async () => {
    if (!localTracks.current.audioTrack) return;
    await localTracks.current.audioTrack.setEnabled(isAudioMuted);
    setIsAudioMuted(!isAudioMuted);
  };

  const handleVideoToggle = async () => {
    if (!localTracks.current.videoTrack) return;
    await localTracks.current.videoTrack.setEnabled(isVideoMuted);
    setIsVideoMuted(!isVideoMuted);
  };

  const toggleScreenShare = async () => {
    if (!client.current) return;

    if (!isScreenSharing) {
      try {
        const track = await AgoraRTC.createScreenVideoTrack();
        screenTrack.current = track;
        await client.current.unpublish(localTracks.current.videoTrack);
        await client.current.publish(track);
        screenTrack.current = track;
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
        throw error;
      }
    } else {
      try {
        await client.current.unpublish(screenTrack.current);
        await client.current.publish(localTracks.current.videoTrack);
        screenTrack?.current?.close();
        screenTrack.current = null;
        setIsScreenSharing(false);
      } catch (error) {
        console.error('Error stopping screen share:', error);
        throw error;
      }
    }
  };

  return {
    isAudioMuted,
    isVideoMuted,
    handleAudioToggle,
    handleVideoToggle,
    toggleScreenShare
  };
};