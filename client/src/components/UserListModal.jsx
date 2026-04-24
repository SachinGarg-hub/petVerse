import { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { followUser } from '../api';
import { useAuth } from '../context/AuthContext';

const UserListModal = ({ isOpen, onClose, title, users, loading: initialLoading }) => {
  const { user: currentUser } = useAuth();
  const [userList, setUserList] = useState([]);
  const [localFollowing, setLocalFollowing] = useState([]);

  useEffect(() => {
    if (users) {
      setUserList(users);
      if (currentUser) {
         // Initialize local following state based on current user's following list or populated data
         // Since we might be looking at followers of another user, we should track who the CURRENT user follows
         setLocalFollowing(currentUser.following || []);
      }
    }
  }, [users, currentUser]);

  const handleFollow = async (userId) => {
    try {
      const isFollowing = localFollowing.includes(userId);
      if (isFollowing) {
        setLocalFollowing(prev => prev.filter(id => id !== userId));
      } else {
        setLocalFollowing(prev => [...prev, userId]);
      }
      await followUser(userId);
    } catch (err) {
      console.error(err);
      // Revert on error
      const isFollowing = localFollowing.includes(userId);
      if (isFollowing) {
        setLocalFollowing(prev => prev.filter(id => id !== userId));
      } else {
        setLocalFollowing(prev => [...prev, userId]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="glass-strong w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[70vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-petverse-darkCard/50 backdrop-blur-md sticky top-0 z-10">
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <HiXMark size={24} />
            </button>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {initialLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                 <div className="w-8 h-8 border-2 border-petverse-purple border-t-transparent rounded-full animate-spin" />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching users...</p>
              </div>
            ) : userList.length > 0 ? (
              userList.map((user) => {
                const isMe = currentUser?._id === user._id;
                const isFollowing = localFollowing.includes(user._id);

                return (
                  <div key={user._id} className="flex items-center justify-between gap-3 animate-fade-in">
                    <Link 
                      to={`/profile/${user._id}`} 
                      onClick={onClose}
                      className="flex items-center gap-3 group"
                    >
                      <img 
                        src={user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                        alt={user.username} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-petverse-purple transition-all"
                      />
                      <div className="text-sm">
                        <p className="font-bold text-gray-800 dark:text-white leading-tight group-hover:text-petverse-purple transition-colors">
                          {user.username}
                        </p>
                        <p className="text-gray-400 truncate w-32 md:w-44 text-xs font-medium">
                          {user.bio || 'Pet lover 🐾'}
                        </p>
                      </div>
                    </Link>

                    {!isMe && (
                      <button 
                        onClick={() => handleFollow(user._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          isFollowing 
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-red-50 hover:text-red-500' 
                            : 'bg-petverse-purple text-white shadow-glow hover:scale-105'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 font-medium italic">No users found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserListModal;
