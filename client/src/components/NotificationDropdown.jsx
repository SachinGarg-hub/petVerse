import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { markNotificationRead } from '../api';

const NotificationDropdown = ({ notifications, onRead, onClose }) => {
  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif._id);
        onRead(notif._id);
      } catch (err) {
        console.error(err);
      }
    }

    onClose();
    
    // Navigate based on type
    if (notif.type === 'like' || notif.type === 'comment') {
      navigate(`/`); // In a real app, go to specific post
    } else if (notif.type === 'follow') {
      navigate(`/profile/${notif.sender._id}`);
    } else if (notif.type === 'message') {
      navigate('/messages');
    } else if (notif.type === 'reel_like') {
      navigate('/reels');
    }
  };

  const getMessage = (type) => {
    switch (type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'follow': return 'started following you';
      case 'message': return 'sent you a message';
      case 'reel_like': return 'liked your reel';
      default: return 'interacted with you';
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 glass-strong rounded-3xl shadow-glass-lg z-50 overflow-hidden border border-gray-100 dark:border-white/10 animate-scale-in origin-top-right">
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-black/20">
        <h3 className="font-bold dark:text-white">Notifications</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-petverse-purple">Recent Activity</span>
      </div>

      <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 ${!notif.read ? 'bg-purple-500/5' : ''}`}
            >
              <div className="relative shrink-0">
                <img
                  src={notif.sender.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender.username}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                />
                {!notif.read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-petverse-purple rounded-full border-2 border-white dark:border-petverse-dark shadow-glow" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm dark:text-gray-200">
                  <span className="font-bold">{notif.sender.username}</span> {getMessage(notif.type)}
                </p>
                {notif.content && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 italic">"{notif.content}"</p>
                )}
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>

              {(notif.post || notif.reel) && (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/5">
                   {notif.post ? (
                      <img src={notif.post.mediaUrl} alt="post" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-white">Reel</div>
                   )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <span className="text-4xl mb-3 block">🔔</span>
            <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-gray-50 dark:bg-black/20 text-center border-t border-gray-100 dark:border-white/5">
        <button className="text-xs font-bold text-petverse-purple hover:underline">View All Activity</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
