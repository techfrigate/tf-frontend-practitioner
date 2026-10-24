import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDevices } from '../../hooks/VideoCunsultations/useDevices';
import { useMeeting } from '../../Context/MeetingContext';
import { useAgoraClient } from '../../hooks/VideoCunsultations/useAgoraClient';
import { useAgoraControls } from '../../hooks/VideoCunsultations/useAgoraControls';
import { Chat } from '../../Components/VideoConsultation/Chat';
import AddPeoplePanel from '../../Components/VideoConsultation/AddPeoplePanel';
import { callApi } from '../../util/callApi';
import toast from 'react-hot-toast';
import { MinimizedMeeting } from '../../Components/VideoConsultation/MinimizedMeeting';
import { VideoGrid } from '../../Components/VideoConsultation/VideoGrid';
import { MeetingControls } from '../../Components/VideoConsultation/MeetingControls';
import { Settings } from '../../Components/VideoConsultation/Settings';
import { useAgoraRTM } from '../../hooks/VideoCunsultations/useAgoraRTM';
import { ParticipantsList } from '../../Components/VideoConsultation/ParticipantsList';
import { useSelector } from 'react-redux';

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
  // The App ID comes from the backend with the tokens, so the frontend build needs no Agora config.
  const [APP_ID, setAppId] = useState('');
  // Numeric uid, fresh per call: Agora treats string uids as accounts, which don't mix with the patient's numeric uid.
  const uidRef = useRef(Math.floor(Math.random() * 1e9) + 1);
  // Chat (RTM) id: unique for every call session, so two windows never knock each other out.
  const chatuid = useRef(`d-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`)

  const{profileData} = useSelector((state)=>state.profile)
  const userName = `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || 'You';
  const chatName = profileData?.firstName ? `Dr. ${userName}` : undefined;
  
  const {client,localTracks,screenTrack,remoteUsers,isScreenSharing,setIsScreenSharing,initializeClient,cleanup} = useAgoraClient(APP_ID, channelName, rtcToken, uidRef.current);

  const {isAudioMuted,isVideoMuted,handleAudioToggle,handleVideoToggle,toggleScreenShare} = useAgoraControls(client, localTracks, screenTrack, setIsScreenSharing,isScreenSharing);

  const {messages,sendMessage,status: chatStatus,error: chatError,peers} = useAgoraRTM(APP_ID, channelName, rtmToken, chatuid.current, chatName, Number(uidRef.current), 'practitioner');

  // People in the call besides the doctor and patient: guest links, added doctors/patients, patient requests.
  const [callInfo, setCallInfo] = useState(null);
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
  const seenRequests = useRef(new Set());
  const loadCallInfo = useCallback(() => {
    if (!currentPatientId) return;
    callApi.details(currentPatientId).then((d) => {
      setCallInfo(d);
      d.invites.filter((i) => i.status === 'pending' && !seenRequests.current.has(i._id)).forEach((i) => {
        seenRequests.current.add(i._id);
        toast(`${i.requestedBy?.name} wants to invite ${i.label}`, { icon: '👋' });
      });
    }).catch(() => {});
  }, [currentPatientId]);
  useEffect(() => {
    loadCallInfo();
    const t = setInterval(loadCallInfo, 5000);
    return () => clearInterval(t);
  }, [loadCallInfo]);
  const pendingRequests = (callInfo?.invites || []).filter((i) => i.status === 'pending').length;

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
        // Tokens are only issued to people who belong to this consultation.
        const data = await callApi.tokens(currentPatientId, { rtcUid: Number(uidRef.current), rtmUid: chatuid.current });
        setAppId(data.appId);
        setRtcToken(data.rtcToken);
        setRtmToken(data.rtmToken)
      } catch (error) {
        console.error('Failed to fetch token:', error);
        toast.error(error.message || 'Could not start the video call');
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
        callApi.endLive(currentPatientId).catch(() => {}); // patients stop seeing "doctor is ready"
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
    ...remoteUsers.map((u) => ({ ...u, name: peers[String(u.uid)]?.name || 'Joining…' })),
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
                canAddPeople={callInfo?.role === 'host'}
                pendingRequests={pendingRequests}
                onAddPeople={() => setIsAddPeopleOpen((o) => !o)}
              />
            </div>
          </div>
          {isAddPeopleOpen && callInfo?.role === 'host' && (
            <AddPeoplePanel appointmentId={currentPatientId} invites={callInfo.invites} onChanged={loadCallInfo} onClose={() => setIsAddPeopleOpen(false)} />
          )}
        </main>

        <Chat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={sendMessage}
          status={chatStatus}
          error={chatError}
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