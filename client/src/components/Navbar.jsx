import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead } from '../api';
import NotificationDropdown from './NotificationDropdown';
import { 
  HiHome, 
  HiOutlineHome, 
  HiSearch, 
  HiOutlineSearch, 
  HiChat, 
  HiOutlineChat,
  HiHeart,
  HiOutlineHeart,
  HiUser,
  HiOutlineUser,
  HiFilm,
  HiOutlineFilm,
  HiPlusCircle,
  HiOutlineLogout
} from 'react-icons/hi';
import { MdOutlinePets, MdPets } from 'react-icons/md';

const Navbar = () => {
  const { user, toggleDark, darkMode, logout, socket } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await getNotifications();
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on('newNotification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Optional: show a toast or browser notification here
      });
    }
    return () => {
      if (socket?.current) {
        socket.current.off('newNotification');
      }
    };
  }, [socket, socket?.current]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong z-50 px-4 py-2 md:top-0 md:bottom-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="hidden md:flex items-center gap-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-glow">
            <MdPets size={24} />
          </div>
          <span className="text-2xl font-display font-extrabold gradient-text">PetVerse</span>
        </Link>

        <div className="flex flex-1 justify-around md:justify-center md:gap-8 items-center">
          <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
            {isActive('/') ? <HiHome size={28} /> : <HiOutlineHome size={28} />}
            <span className="hidden lg:block">Home</span>
          </Link>
          <Link to="/explore" className={`sidebar-link ${isActive('/explore') ? 'active' : ''}`}>
            {isActive('/explore') ? <HiSearch size={28} /> : <HiOutlineSearch size={28} />}
            <span className="hidden lg:block">Explore</span>
          </Link>
          <Link to="/reels" className={`sidebar-link ${isActive('/reels') ? 'active' : ''}`}>
            {isActive('/reels') ? <HiFilm size={28} /> : <HiOutlineFilm size={28} />}
            <span className="hidden lg:block">Reels</span>
          </Link>
          <Link to="/adoption" className={`sidebar-link ${isActive('/adoption') ? 'active' : ''}`}>
            {isActive('/adoption') ? <MdPets size={28} /> : <MdOutlinePets size={28} />}
            <span className="hidden lg:block">Adopt</span>
          </Link>
          <Link to="/messages" className={`sidebar-link ${isActive('/messages') ? 'active' : ''}`}>
            {isActive('/messages') ? <HiChat size={28} /> : <HiOutlineChat size={28} />}
            <span className="hidden lg:block">Messages</span>
          </Link>
          <Link to={`/profile/${user?._id}`} className={`sidebar-link ${isActive(`/profile/${user?._id}`) ? 'active' : ''}`}>
            {isActive(`/profile/${user?._id}`) ? <HiUser size={28} /> : <HiOutlineUser size={28} />}
            <span className="hidden lg:block">Profile</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (unreadCount > 0) handleMarkAllRead();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${showNotifs ? 'bg-petverse-purple/10 text-petverse-purple' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500'}`}
            >
              {showNotifs ? <HiHeart size={24} /> : <HiOutlineHeart size={24} />}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-petverse-dark">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <NotificationDropdown 
                notifications={notifications} 
                onRead={(id) => {
                  setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
                }}
                onClose={() => setShowNotifs(false)}
              />
            )}
          </div>

          <button 
            onClick={toggleDark}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {user?.profilePic ? (
            <img src={user.profilePic} alt="profile" className="w-10 h-10 rounded-full object-cover border-2 border-petverse-purple" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={logout}
            className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Logout"
          >
            <HiOutlineLogout size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
