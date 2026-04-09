import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../api';
import { io } from 'socket.io-client';
import { HiPaperAirplane, HiOutlineChatAlt, HiOutlinePaperClip, HiOutlineMicrophone } from 'react-icons/hi';
import { format } from 'date-fns';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:5000');
    socket.current.emit('addUser', user?._id);
    socket.current.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });
    socket.current.on('getMessage', (data) => {
      if (currentChat?.members.some(m => m._id === data.senderId)) {
        setMessages((prev) => [...prev, { ...data, sender: { _id: data.senderId } }]);
      }
    });
    
    return () => socket.current.disconnect();
  }, [user?._id, currentChat]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [user?._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const res = await getMessages(currentChat._id);
          setMessages(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = currentChat.members.find(m => m._id !== user._id)._id;
    
    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await sendMessageApi({
        conversationId: currentChat._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const getOtherMember = (members) => members.find(m => m._id !== user._id);

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 animate-fade-in">
      {/* Conversations List */}
      <div className="w-80 card flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-2xl font-bold dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-petverse-purple/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
          {conversations.map(c => {
            const other = getOtherMember(c.members);
            const isOnline = onlineUsers.includes(other?._id);
            return (
              <div 
                key={c._id}
                onClick={() => setCurrentChat(c)}
                className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${currentChat?._id === c._id ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-800/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <div className="relative shrink-0">
                  <img src={other?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.username}`} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                  {isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-petverse-darkCard rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-bold text-gray-800 dark:text-white truncate">{other?.username}</p>
                    <span className="text-[10px] text-gray-400">12:45 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.lastMessage || 'Start a conversation'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={getOtherMember(currentChat.members).profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${getOtherMember(currentChat.members).username}`} 
                  className="w-10 h-10 rounded-full object-cover" 
                  alt="avatar" 
                />
                <div>
                  <p className="font-bold text-gray-800 dark:text-white leading-none">{getOtherMember(currentChat.members).username}</p>
                  <p className="text-xs text-green-500 mt-1 font-medium">{onlineUsers.includes(getOtherMember(currentChat.members)._id) ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
              {messages.map((m, idx) => {
                const isMe = m.sender._id === user._id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-3xl text-sm ${isMe ? 'bg-petverse-purple text-white rounded-tr-none shadow-glow' : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                      {m.text}
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {format(new Date(m.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-gray-50/50 dark:bg-white/2 overflow-hidden">
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-2xl border border-gray-200 dark:border-white/10">
                <button type="button" className="text-gray-400 hover:text-petverse-purple transition-colors">
                  <HiOutlinePaperClip size={24} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-2 text-sm text-gray-800 dark:text-white focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="button" className="text-gray-400 hover:text-petverse-purple transition-colors">
                  <HiOutlineMicrophone size={24} />
                </button>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-glow disabled:opacity-50 transition-all hover:scale-105"
                >
                  <HiPaperAirplane size={20} className="rotate-90" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-full flex items-center justify-center text-petverse-purple mb-6">
              <HiOutlineChatAlt size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a conversation</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">Connect with other pet parents for playdates or adoption inquiries!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
