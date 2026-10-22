import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

/**
 * In-call chat over Agora Signaling (RTM) SDK v2.
 *
 * - `uid` must be unique per call participant (the backend signs the RTM token for it); two logins with
 *   the same id disconnect each other.
 * - Start/stop run strictly one after another, so React StrictMode's mount → unmount → mount in
 *   development can't leave a stale login that kicks the live one.
 * - Every chat message carries the sender's name, so late joiners still see who wrote what.
 */
export const useAgoraRTM = (APP_ID, channelName, rtmToken, uid, userName, rtcUid, role) => {
  const rtm = useRef(null);
  const queue = useRef(Promise.resolve());
  const [status, setStatus] = useState('idle'); // idle | connecting | connected | failed
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  // Names of the people in the call, keyed by their video (RTC) uid – used to label video tiles.
  const [peers, setPeers] = useState({});
  const me = useRef({});
  me.current = { name: userName, rtcUid, role };

  useEffect(() => {
    if (!APP_ID || !channelName || !rtmToken || !uid) return undefined;
    let active = true;
    let client = null;

    const announce = (hello) =>
      client?.publish(channelName, JSON.stringify({ type: 'presence', hello, name: me.current.name, rtcUid: me.current.rtcUid, role: me.current.role })).catch(() => {});

    const onMessage = (event) => {
      if (event.channelName !== channelName) return;
      // Agora also delivers our own messages back to us; we've already shown them locally.
      if (String(event.publisher) === String(uid)) return;
      let data = null;
      try {
        data = JSON.parse(event.message);
      } catch {
        data = null;
      }
      if (data?.type === 'presence') {
        if (data.rtcUid !== undefined) setPeers((prev) => ({ ...prev, [String(data.rtcUid)]: { name: data.name, role: data.role } }));
        if (data.hello) announce(false); // introduce ourselves to the newcomer
        return;
      }
      if (data && data.type && data.type !== 'chat') return; // other control messages
      setMessages((prev) => [
        ...prev,
        {
          text: data ? data.text : String(event.message),
          senderId: event.publisher,
          senderName: data?.name || 'Participant',
          timestamp: new Date(event.timestamp || Date.now()).toISOString(),
        },
      ]);
    };
    const onStatus = (event) => {
      if (!active) return;
      if (event.state === 'CONNECTED') setStatus('connected');
      else if (event.state === 'CONNECTING' || event.state === 'RECONNECTING') setStatus('connecting');
      else if (event.state === 'DISCONNECTED' || event.state === 'FAILED') {
        setStatus('failed');
        setError(event.reason === 'SAME_UID_LOGIN' ? 'Chat was opened in another window.' : 'Chat disconnected.');
      }
    };

    const start = async () => {
      if (!active) return;
      setStatus('connecting');
      setError('');
      client = new AgoraRTM.RTM(APP_ID, String(uid));
      client.addEventListener('message', onMessage);
      client.addEventListener('status', onStatus);
      try {
        await client.login({ token: rtmToken });
        await client.subscribe(channelName);
        if (!active) return;
        rtm.current = client;
        setStatus('connected');
        announce(true);
      } catch (e) {
        console.error('RTM initialization failed:', e);
        if (active) {
          setStatus('failed');
          setError('Chat could not connect.');
        }
      }
    };
    const stop = async () => {
      if (!client) return;
      client.removeEventListener('message', onMessage);
      client.removeEventListener('status', onStatus);
      if (rtm.current === client) rtm.current = null;
      try {
        await client.unsubscribe(channelName);
      } catch {
        /* not subscribed */
      }
      try {
        await client.logout();
      } catch {
        /* not logged in */
      }
    };

    queue.current = queue.current.then(start);
    return () => {
      active = false;
      queue.current = queue.current.then(stop);
    };
  }, [APP_ID, channelName, rtmToken, uid]);

  const sendMessage = useCallback(
    async (text) => {
      if (!rtm.current) throw new Error('Chat is still connecting – please try again in a moment.');
      await rtm.current.publish(channelName, JSON.stringify({ type: 'chat', text, name: userName || 'Participant' }));
      setMessages((prev) => [...prev, { text, senderId: String(uid), senderName: userName || 'You', timestamp: new Date().toISOString(), isLocal: true }]);
    },
    [channelName, uid, userName]
  );

  return { chatChannel: status === 'connected' ? channelName : null, status, error, messages, sendMessage, peers };
};
