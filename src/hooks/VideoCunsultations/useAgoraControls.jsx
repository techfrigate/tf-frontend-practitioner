import { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import toast from 'react-hot-toast';

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

  // Switch back from the shared screen to the camera.
  const stopScreenShare = async () => {
    const track = screenTrack.current;
    screenTrack.current = null;
    try {
      if (track) await client.current?.unpublish(track);
    } catch {
      /* already unpublished */
    }
    track?.close();
    try {
      if (localTracks.current.videoTrack) await client.current?.publish(localTracks.current.videoTrack);
    } catch (error) {
      console.error('Could not restore the camera:', error);
    }
    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (!client.current) return;
    if (isScreenSharing) {
      await stopScreenShare();
      return;
    }

    let track;
    try {
      const created = await AgoraRTC.createScreenVideoTrack({}, 'disable');
      track = Array.isArray(created) ? created[0] : created;
    } catch (error) {
      // The user closed the "choose what to share" dialog – nothing to do.
      const cancelled = error?.code === 'PERMISSION_DENIED' || error?.name === 'NotAllowedError' || /Permission denied|NotAllowedError/i.test(error?.message || '');
      if (!cancelled) toast.error('Screen sharing is not available in this browser.');
      return;
    }

    try {
      screenTrack.current = track;
      // The browser's own "Stop sharing" button ends the track: switch back to the camera.
      track.on('track-ended', () => stopScreenShare());
      if (localTracks.current.videoTrack) await client.current.unpublish(localTracks.current.videoTrack);
      await client.current.publish(track);
      setIsScreenSharing(true);
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast.error('Could not share your screen. Please try again.');
      await stopScreenShare();
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