import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useAgoraClient = (APP_ID, channelName, rtcToken, uid) => {
  const client = useRef(null);
  const localTracks = useRef({ audioTrack: null, videoTrack: null });
  const screenTrack = useRef(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleUserPublished = async (user, mediaType) => {
    if (!client.current) return;
    await client.current.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setRemoteUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.uid === user.uid);
        if (existingUser) {
          return prevUsers.map(u => 
            u.uid === user.uid ? { ...u, isVideoMuted: false } : u
          );
        }
        return [...prevUsers, { 
          uid: user.uid, 
          name: `User ${user.uid}`, 
          isAudioMuted: false, 
          isVideoMuted: false 
        }];
      });
      user.videoTrack?.play(`player-${user.uid}`);
    }

    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers(prevUsers =>
        prevUsers.map(u => u.uid === user.uid ? { ...u, isVideoMuted: true } : u)
      );
    }
  };

  const handleUserJoined = (user) => {
    setRemoteUsers(prevUsers => {
      if (prevUsers.find(u => u.uid === user.uid)) return prevUsers;
      return [...prevUsers, { 
        uid: user.uid, 
        name: `User ${user.uid}`, 
        isAudioMuted: true, 
        isVideoMuted: true 
      }];
    });
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
  };

  const initializeClient = async () => {
    try {
      client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      client.current.on('user-published', handleUserPublished);
      client.current.on('user-unpublished', handleUserUnpublished);
      client.current.on('user-joined', handleUserJoined);
      client.current.on('user-left', handleUserLeft);

      await client.current.join(APP_ID, channelName, rtcToken, uid);

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(  {
        encoderConfig: '1080p_1'
      },
      {
        encoderConfig: '1080p_1'
      });
      localTracks.current = { audioTrack, videoTrack };

      await client.current.publish([audioTrack, videoTrack]);
      videoTrack.play('player-local');
    } catch (error) {
      console.error('Error initializing Agora:', error);
      throw error;
    }
  };

  const cleanup = async () => {
    localTracks.current.audioTrack?.stop();
    localTracks.current.audioTrack?.close();
    localTracks.current.videoTrack?.stop();
    localTracks.current.videoTrack?.close();
    screenTrack.current?.stop();
    screenTrack.current?.close();
    await client.current?.leave();
    localTracks.current = { audioTrack: null, videoTrack: null };
    screenTrack.current = null;
    setRemoteUsers([]);
  };

  return {
    client: client,
    localTracks: localTracks,
    screenTrack: screenTrack,
    remoteUsers,
    isScreenSharing,
    setIsScreenSharing,
    initializeClient,
    cleanup
  };
};