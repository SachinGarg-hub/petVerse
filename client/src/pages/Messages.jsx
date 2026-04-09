import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage, createConversation, searchUsers } from '../api';
import { io } from 'socket.io-client';
import { HiOutlineMagnifyingGlass, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const socket = useRef();
  const scrollRef = useRef();

  // Initialize Socket Connection
  useEffect(() => {
    socket.current = io('http://localhost:5000');
    
    if (user) {
      socket.current.emit('addUser', user._id);
      socket.current.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });
    }

    socket.current.on('getMessage', (data) => {
      setMessages((prev) => [...prev, {
        sender: { _id: data.senderId },
        text: data.text,
        createdAt: Date.now()
      }]);
    });

    socket.current.on('userTyping', () => setIsTyping(true));
    socket.current.on('userStopTyping', () => setIsTyping(false));

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Fetch Conversations
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
  }, []);

  // Fetch Messages for current chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await getMessages(currentChat._id);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [currentChat]);

  // Handle User Search
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await searchUsers(searchQuery);
        setSearchResults(res.data.filter(u => u._id !== user._id));
      } catch (err) {
        console.error(err);
      }
    };
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, user]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartConversation = async (receiverId) => {
    try {
      const res = await createConversation(receiverId);
      const existing = conversations.find(c => c._id === res.data._id);
      if (!existing) {
        setConversations(prev => [res.data, ...prev]);
      }
      setCurrentChat(res.data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const receiverId = currentChat.members.find(m => m._id !== user._id)._id;

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage
    });

    try {
      const res = await sendMessage({
        conversationId: currentChat._id,
        text: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  let typingTimeout = null;
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!currentChat) return;
    
    const receiverId = currentChat.members.find(m => m._id !== user._id)._id;
    socket.current.emit('typing', { senderId: user._id, receiverId });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.current.emit('stopTyping', { senderId: user._id, receiverId });
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] mt-4 gap-6 animate-fade-in">
      {/* Sidebar: Conversations */}
      <div className={`card w-full md:w-96 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users to message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 py-3 rounded-full text-sm"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 mx-6 z-20 card max-h-60 overflow-y-auto">
              {searchResults.map(u => (
                <div 
                  key={u._id}
                  onClick={() => handleStartConversation(u._id)}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <img src={u.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt={u.username} className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-bold text-gray-800 dark:text-white">{u.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
          {conversations.map(c => {
            const friend = c.members.find(m => m._id !== user._id);
            const isOnline = onlineUsers.includes(friend._id);
            const isSelected = currentChat?._id === c._id;

            return (
              <div 
                key={c._id}
                onClick={() => setCurrentChat(c)}
                className={`p-3 rounded-2xl cursor-pointer flex items-center gap-4 transition-all ${isSelected ? 'bg-petverse-purple/10 border border-petverse-purple/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'}`}
              >
                <div className="relative">
                  <img src={friend.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} alt="avatar" className="w-12 h-12 rounded-2xl object-cover" />
                  {isOnline && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-petverse-darkCard rounded-full" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm">{friend.username}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      {currentChat ? (
        <div className={`card flex-1 flex flex-col overflow-hidden ${!currentChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md z-10">
            <button className="md:hidden text-gray-500" onClick={() => setCurrentChat(null)}>
              ← Back
            </button>
            <div className="relative">
              <img 
                src={currentChat.members.find(m => m._id !== user._id).profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.members.find(m => m._id !== user._id).username}`} 
                alt="user" 
                className="w-10 h-10 rounded-xl object-cover" 
              />
              {onlineUsers.includes(currentChat.members.find(m => m._id !== user._id)._id) && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-petverse-darkCard rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white leading-tight">
                {currentChat.members.find(m => m._id !== user._id).username}
              </h3>
              <p className="text-xs text-gray-500">
                {onlineUsers.includes(currentChat.members.find(m => m._id !== user._id)._id) ? 'Active Now' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, idx) => {
              const myMessage = m.sender._id === user._id;
              return (
                <div key={idx} className={`flex ${myMessage ? 'justify-end' : 'justify-start'}`} ref={scrollRef}>
                  <div className={`max-w-[70%] px-5 py-3 rounded-3xl ${myMessage ? 'gradient-primary text-white rounded-tr-sm shadow-glow-sm' : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white rounded-tl-sm'}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${myMessage ? 'text-white/70 text-right' : 'text-gray-500 text-left'}`}>
                      {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-white/10 px-5 py-4 rounded-3xl rounded-tl-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-white/5 gap-3 flex">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMessage}
              onChange={handleTyping}
              className="input-field py-4 rounded-full flex-1"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white shadow-glow disabled:opacity-50 transition-transform active:scale-95"
            >
              <HiOutlinePaperAirplane size={24} className="-rotate-45 relative right-0.5 bottom-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 card items-center justify-center flex-col text-center p-10">
          <div className="w-24 h-24 rounded-full bg-petverse-purple/10 flex items-center justify-center text-petverse-purple mb-6">
            <HiOutlinePaperAirplane size={40} className="-rotate-45 relative right-2 bottom-2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Messages</h2>
          <p className="text-gray-500 max-w-sm">Connect with other pet owners, schedule playdates, or ask about adoptions privately.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
