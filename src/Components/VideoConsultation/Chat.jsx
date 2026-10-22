import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const STATUS = {
  connecting: { text: 'Connecting…', dot: 'bg-amber-400' },
  connected: { text: 'Connected', dot: 'bg-emerald-500' },
  failed: { text: "Couldn't connect", dot: 'bg-rose-500' },
  idle: { text: 'Waiting for the call…', dot: 'bg-slate-300' },
};

export const Chat = ({ isOpen, onClose, messages, onSendMessage, status = 'idle', error }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    setSending(true);
    try {
      await onSendMessage(text);
      setNewMessage('');
    } catch (err) {
      toast.error(err?.message || 'Message not sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;
  const s = STATUS[status] || STATUS.idle;
  const connected = status === 'connected';

  return (
    <div className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {status === 'failed' && error ? error : s.text}
            </p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-gray-700" aria-label="Close chat">
            ×
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!messages.length && <p className="text-center text-sm text-slate-400">No messages yet. Say hello 👋</p>}
          {messages.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.isLocal ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${message.isLocal ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="mb-1 text-xs font-semibold opacity-80">{message.isLocal ? 'You' : message.senderName || 'Participant'}</p>
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <p className="mt-1 text-[10px] opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={connected ? 'Type a message...' : 'Chat is connecting…'}
              aria-label="Type a message"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!connected || sending || !newMessage.trim()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
