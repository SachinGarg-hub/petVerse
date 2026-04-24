import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const ActivityPanel = ({ isOpen, notifications, onClose, onRead }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed left-20 lg:left-64 top-0 bottom-0 w-80 lg:w-96 bg-white dark:bg-petverse-dark border-r border-gray-100 dark:border-white/5 z-[55] shadow-2xl flex flex-col"
    >
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Activity</h2>
          <button onClick={onClose} className="md:hidden">
            <HiXMark size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n._id}
                onClick={() => onRead(n._id)}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${n.read ? 'opacity-60' : 'bg-purple-50/50 dark:bg-purple-900/10'}`}
              >
                <img 
                  src={n.sender.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender.username}`} 
                  className="w-10 h-10 rounded-full object-cover shrink-0" 
                  alt="p" 
                />
                <div className="flex-1 text-sm">
                  <p className="dark:text-white leading-snug">
                    <span className="font-bold">{n.sender.username}</span>{' '}
                    {n.type === 'like' && 'liked your post.'}
                    {n.type === 'comment' && 'commented on your post.'}
                    {n.type === 'follow' && 'started following you.'}
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {formatDistanceToNow(new Date(n.createdAt))} ago
                  </span>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-petverse-purple mt-2" />}
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
               <p className="text-sm text-gray-500 italic">No activity yet. 🐾</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityPanel;
