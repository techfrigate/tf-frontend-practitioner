import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useDevices } from '../../hooks/VideoCunsultations/useDevices';
import { useMeeting } from '../../Context/MeetingContext';
import { useAgoraClient } from '../../hooks/VideoCunsultations/useAgoraClient';
import { useAgoraControls } from '../../hooks/VideoCunsultations/useAgoraControls';
import { Chat } from '../../Components/VideoConsultation/Chat';
import { MinimizedMeeting } from '../../Components/VideoConsultation/MinimizedMeeting';
import { VideoGrid } from '../../Components/VideoConsultation/VideoGrid';
import { MeetingControls } from '../../Components/VideoConsultation/MeetingControls';
import { Settings } from '../../Components/VideoConsultation/Settings';
import { useAgoraRTM } from '../../hooks/VideoCunsultations/useAgoraRTM';
import { ParticipantsList } from '../../Components/VideoConsultation/ParticipantsList';
import { useSelector } from 'react-redux';

const APP_ID = "b7e860008eb7454d8a6eb53957ba3952";
const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;

const VideoConsultation = ({ 
  channelName,
  isSheetOpen,
  setIsSheetOpen,
  setChannelName,
  currentPatientId,
  updatePatientToCheckedOut
}) => {
  const navigate = useNavigate();
  const devices = useDevices();
  const { isMinimized, setIsMinimized, setInMeeting } = useMeeting();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rtcToken, setRtcToken] = useState('');
  const [rtmToken, setRtmToken] = useState('');
  const uidRef = useRef(Cookies.get('uid') || Math.floor(Math.random() * 10000).toString());
  const chatuid = useRef(Cookies.get('uidRtm') || Math.floor(Math.random() * 10000).toString())

  const{profileData} = useSelector((state)=>state.profile)
  const userName = `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || 'You';
  
  const {client,localTracks,screenTrack,remoteUsers,isScreenSharing,setIsScreenSharing,initializeClient,cleanup} = useAgoraClient(APP_ID, channelName, rtcToken, uidRef.current);

  const {isAudioMuted,isVideoMuted,handleAudioToggle,handleVideoToggle,toggleScreenShare} = useAgoraControls(client, localTracks, screenTrack, setIsScreenSharing,isScreenSharing);

  const {messages,sendMessage} = useAgoraRTM(APP_ID, channelName, rtmToken, chatuid.current);

  useEffect(() => {
    console.log(isAudioMuted, "isAudioMuted");
    if (channelName) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";  
    }

    return () => {
      document.body.style.overflow = "auto";  
    };
  }, [channelName]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${ACCOUNTS_URL}/auth/tokens?channelName=${channelName}&uid=${uidRef.current}&role=publisher&uidRtm=${chatuid.current}`
        );
        const data = await response.json();
        Cookies.set('uid', uidRef.current);
        Cookies.set('uidRtm', uidRef.current);
        setRtcToken(data.rtcToken);
        setRtmToken(data.rtmToken)
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };
    
    if (!rtcToken) fetchToken();
  }, [channelName]);

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionsGranted(true);
    } catch (error) {
      showPermissionDialog();
    }
  };

  const showPermissionDialog = () => {
    Swal.fire({
      title: 'Permissions Required',
      text: 'Camera and microphone permissions are required to join the video call.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Try Again',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        requestPermissions();
      } else {
        navigate('/worklist');
      }
    });
  };

  const handleLeave = async () => {
    const result = await Swal.fire({
      title: 'Leave Meeting',
      text: 'Are you sure you want to leave the meeting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await cleanup();
        setInMeeting(false);
        setIsMinimized(false);
        setChannelName('');
        
        if (currentPatientId && updatePatientToCheckedOut) {
          await updatePatientToCheckedOut(currentPatientId);
        } else {
          console.log("Missing currentPatientId or updatePatientToCheckedOut function");
        }
      } catch (error) {
        console.error('Error handling leave:', error);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
    return ()=>{
      cleanup()
    };
  }, []);

  useEffect(() => {
    if (permissionsGranted && rtcToken) {
      initializeClient();
      setInMeeting(true);
    }
  }, [permissionsGranted, rtcToken]);

  const handleMinimize = () => {
    setIsMinimized(true);

    setTimeout(() => {
      const videoContainer = document.getElementById('minimized-video');
      if (videoContainer && localTracks.current.videoTrack) {
        localTracks.current.videoTrack.play(videoContainer);
      }
    }, 0);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setTimeout(()=>{
      if (localTracks.current.videoTrack) {
        localTracks.current.videoTrack.play('player-local');
      }
    },0)
  };

  if (isMinimized) {
    return (
      <MinimizedMeeting
        channelName={channelName}
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        onMaximize={handleMaximize}
      />
    );
  }

  const participants = [
    {
      uid: 'local',
      name: userName,
      isAudioMuted,
      isVideoMuted,
      isScreenSharing,
    },
    ...remoteUsers
  ];

  return (
    <div className="h-full w-full  absolute left-0 bottom-0 right-0 top-0  z-50">
      <div
        className={`flex flex-col h-full w-full  ${
          isMinimized ? 'fixed bottom-4 right-4 h-48 w-80 rounded-lg shadow-lg' : ''
        }`}
      >
        <main className="flex-1 overflow-hidden ">
          <VideoGrid participants={participants} />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
              <MeetingControls
                isAudioMuted={isAudioMuted}
                currentPatientId={currentPatientId}
                isVideoMuted={isVideoMuted}
                isScreenSharing={isScreenSharing}
                onAudioToggle={handleAudioToggle}
                onVideoToggle={handleVideoToggle}
                onScreenShare={toggleScreenShare}
                onChatToggle={() => setIsChatOpen(!isChatOpen)}
                onParticipantsToggle={() => setIsParticipantsOpen(!isParticipantsOpen)}
                onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
                onMinimize={handleMinimize}
                onLeave={handleLeave}
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
              />
            </div>
          </div>
        </main>

        <Chat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={sendMessage}
        />

        <ParticipantsList
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          participants={participants}
        />
        
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onDeviceChange={() => {}}
          audioInputDevices={devices.audioInput}
          audioOutputDevices={devices.audioOutput}
          videoDevices={devices.video}
        />
      </div>
    </div>
  );
};

export default VideoConsultation;