// import React, { useState, useEffect } from 'react';
// import { MessageCircle, Send } from 'lucide-react';

// export const Chat = ({ isOpen, onClose, chatChannel }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   useEffect(() => {
//     if (!chatChannel) {
//       console.warn('Chat channel not initialized');
//       return;
//     }

//     const handleChannelMessage = (message, senderId) => {
//       try {
//         let messageText;
        
//         // Handle different message formats
//         if (typeof message === 'string') {
//           messageText = message;
//         } else if (message.text) {
//           messageText = message.text;
//         } else if (message.message) { // Some versions of RTM use this format
//           messageText = message.message;
//         } else {
//           console.warn('Unrecognized message format:', message);
//           return;
//         }

//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now(),
//             sender: senderId,
//             text: messageText,
//             timestamp: new Date(),
//           },
//         ]);
//       } catch (error) {
//         console.error('Error handling message:', error);
//       }
//     };

//     // Add message listener
//     chatChannel.on('ChannelMessage', handleChannelMessage);

//     return () => {
//       chatChannel.off('ChannelMessage', handleChannelMessage);
//     };
//   }, [chatChannel]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!newMessage.trim() || !chatChannel) return;

//     try {
//       // Try different message formats if one fails
//       try {
//         await chatChannel.sendMessage({ text: newMessage });
//       } catch (error) {
//         console.warn('Failed with text format, trying message format');
//         await chatChannel.sendMessage({ message: newMessage });
//       }
      
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           sender: 'You',
//           text: newMessage,
//           timestamp: new Date(),
//         },
//       ]);
      
//       setNewMessage('');
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       alert('Failed to send message. Please try again.');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b p-4">
//           <div className="flex items-center gap-2">
//             <MessageCircle className="h-5 w-5" />
//             <h2 className="text-lg font-semibold">Chat</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-full p-1 hover:bg-gray-100"
//           >
//             ×
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`mb-4 rounded-lg p-3 ${
//                 message.sender === 'You' 
//                   ? 'bg-blue-100 ml-auto' 
//                   : 'bg-gray-100'
//               } max-w-[80%]`}
//             >
//               <div className="flex items-center justify-between">
//                 <span className="font-semibold">{message.sender}</span>
//                 <span className="text-xs text-gray-500">
//                   {message.timestamp.toLocaleTimeString()}
//                 </span>
//               </div>
//               <p className="mt-1 break-words">{message.text}</p>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <form onSubmit={handleSendMessage} className="border-t p-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 rounded-full border px-4 py-2 focus:border-blue-500 focus:outline-none"
//             />
//             <button
//               type="submit"
//               disabled={!newMessage.trim()}
//               className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
//             >
//               <Send className="h-5 w-5" />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };


import React, { useState } from 'react';

export const Chat = ({ isOpen, onClose, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.isLocal ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isLocal
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {message.isLocal ? 'You' : message.senderId}
                </p>
                <p>{message.text}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};