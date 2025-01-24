import { useEffect, useRef, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

export const useAgoraRTM = (APP_ID, channelName, rtmToken, uid, userName) => {
  const rtmClient = useRef(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState(new Map());

  useEffect(() => {
    const initRTM = async () => {
      if (!rtmToken) return;

      try {
        rtmClient.current = AgoraRTM.createInstance(APP_ID);
        await rtmClient.current.login({ uid, token: rtmToken });

        const channel = rtmClient.current.createChannel(channelName);
        await channel.join();

        // Send user name to all participants
        await channel.sendMessage({
          text: JSON.stringify({ type: 'userName', name: userName, uid })
        });

        channel.on('ChannelMessage', (message, senderId) => {
          try {
            const data = JSON.parse(message.text);
            if (data.type === 'userName') {
              setUserNames(prev => new Map(prev).set(data.uid, data.name));
            } else {
              setMessages(prev => [...prev, {
                text: message.text,
                senderId,
                senderName: userNames.get(senderId) || 'Unknown User',
                timestamp: new Date().toISOString()
              }]);
            }
          } catch {
            // Handle regular chat messages
            setMessages(prev => [...prev, {
              text: message.text,
              senderId,
              senderName: userNames.get(senderId) || 'Unknown User',
              timestamp: new Date().toISOString()
            }]);
          }
        });

        setChatChannel(channel);
      } catch (error) {
        console.error('RTM initialization failed:', error);
      }
    };

    initRTM();

    return () => {
      const cleanup = async () => {
        if (chatChannel) {
          chatChannel.removeAllListeners();
          await chatChannel.leave();
        }
        if (rtmClient.current) {
          await rtmClient.current.logout();
        }
      };
      cleanup();
    };
  }, [APP_ID, channelName, rtmToken, uid, userName]);

  const sendMessage = async (text) => {
    if (!chatChannel) return;

    try {
      await chatChannel.sendMessage({ text });
      setMessages(prev => [...prev, {
        text,
        senderId: uid,
        senderName: userName,
        timestamp: new Date().toISOString(),
        isLocal: true
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return {
    chatChannel,
    messages,
    sendMessage,
    userNames
  };
};