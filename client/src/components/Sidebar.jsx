import { useState, useEffect } from 'react'; // Sidebar refactor v2
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiHome, HiHome as HiHomeActive,
  HiMagnifyingGlass, HiMagnifyingGlass as HiMagnifyingGlassActive,
  HiChatBubbleOvalLeft as HiChat, HiChatBubbleOvalLeft as HiChatActive,
  HiHeart, HiHeart as HiHeartActive,
  HiUser, HiUser as HiUserActive,
  HiFilm, HiFilm as HiFilmActive,
  HiPlusCircle, HiPlusCircle as HiPlusCircleActive,
  HiBars3, HiBars3 as HiBars3Active,
  HiCog6Tooth,
  HiArrowLeftOnRectangle,
  HiOutlineHome, HiOutlineMagnifyingGlass, HiOutlineChatBubbleOvalLeft as HiOutlineChat,
  HiOutlineHeart, HiOutlineUser, HiOutlineFilm, HiOutlinePlusCircle, HiOutlineBars3, HiOutlineCog6Tooth
} from 'react-icons/hi2';
import { MdOutlinePets, MdPets } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePostModal from './CreatePostModal';
import SearchPanel from './SearchPanel';
import ActivityPanel from './ActivityPanel';
import { getNotifications, markAllNotificationsRead } from '../api';

const Sidebar = () => {
  const { user, toggleDark, darkMode, logout, socket } = useAuth();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
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
    if (socket) {
      socket.on('newNotification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }
    return () => {
      if (socket) socket.off('newNotification');
    };
  }, [socket]);

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

  const navItems = [
    { name: 'Home', path: '/', icon: HiOutlineHome, activeIcon: HiHomeActive },
    { name: 'Search', onClick: () => { setIsSearchOpen(!isSearchOpen); setIsActivityOpen(false); }, icon: HiOutlineMagnifyingGlass, activeIcon: HiMagnifyingGlassActive, active: isSearchOpen },
    { name: 'Reels', path: '/reels', icon: HiOutlineFilm, activeIcon: HiFilmActive },
    { name: 'Adopt', path: '/adoption', icon: MdOutlinePets, activeIcon: MdPets },
    { name: 'Messages', path: '/messages', icon: HiOutlineChat, activeIcon: HiChatActive },
    { 
      name: 'Notifications', 
      onClick: () => { 
        setIsActivityOpen(!isActivityOpen); 
        setIsSearchOpen(false);
        if (!isActivityOpen && unreadCount > 0) handleMarkAllRead();
      }, 
      icon: HiOutlineHeart, 
      activeIcon: HiHeartActive,
      badge: unreadCount,
      active: isActivityOpen
    },
    { name: 'Create', onClick: () => setIsCreateModalOpen(true), icon: HiOutlinePlusCircle, activeIcon: HiPlusCircleActive },
    { name: 'Profile', path: `/profile/${user?._id}`, icon: HiOutlineUser, activeIcon: HiUserActive },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-petverse-dark z-[60] py-8 px-4 transition-all duration-300 ${isSearchOpen || isActivityOpen ? 'w-20' : 'w-20 lg:w-64'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform shrink-0">
            <MdPets size={24} />
          </div>
          <span className={`text-2xl font-display font-extrabold gradient-text transition-opacity duration-300 ${isSearchOpen || isActivityOpen ? 'opacity-0 hidden' : 'hidden lg:block'}`}>PetVerse</span>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isCurrentlyActive = item.path ? isActive(item.path) : item.active;
            const Icon = isCurrentlyActive ? item.activeIcon : item.icon;
            
            return (
              <div key={item.name} className="relative">
                {item.onClick ? (
                  <button 
                    onClick={item.onClick}
                    className={`sidebar-link w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group ${item.active ? 'bg-gray-50 dark:bg-white/5 font-bold' : ''}`}
                  >
                    <div className="group-hover:scale-110 transition-transform relative shrink-0">
                      <Icon size={28} className={isCurrentlyActive ? 'text-petverse-purple' : 'text-gray-800 dark:text-gray-200'} />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-petverse-dark">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`font-medium truncate transition-all duration-300 ${isSearchOpen || isActivityOpen ? 'opacity-0 w-0' : 'hidden lg:block'} ${isCurrentlyActive ? 'text-petverse-purple font-bold' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.name}
                    </span>
                  </button>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`sidebar-link flex items-center gap-4 p-3 rounded-xl transition-all group ${isCurrentlyActive ? 'font-bold bg-gray-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  >
                    <div className="group-hover:scale-110 transition-transform shrink-0">
                      <Icon size={28} className={isCurrentlyActive ? 'text-petverse-purple' : 'text-gray-800 dark:text-gray-200'} />
                    </div>
                    <span className={`truncate transition-all duration-300 ${isSearchOpen || isActivityOpen ? 'opacity-0 w-0' : 'hidden lg:block'} ${isCurrentlyActive ? 'text-petverse-purple font-bold' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* More Menu */}
        <div className="relative mt-auto">
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group ${showMore ? 'bg-gray-50 dark:bg-white/5' : ''}`}
          >
            <div className="group-hover:scale-110 transition-transform shrink-0">
              <HiOutlineBars3 size={28} className="text-gray-800 dark:text-gray-200" />
            </div>
            <span className={`font-medium transition-all duration-300 ${isSearchOpen || isActivityOpen ? 'opacity-0 w-0' : 'hidden lg:block'} text-gray-800 dark:text-gray-200`}>More</span>
          </button>

          <AnimatePresence>
            {showMore && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-full left-0 w-56 mb-4 bg-white dark:bg-petverse-darkCard rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-[70]"
              >
                <Link to="/settings" onClick={() => setShowMore(false)} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <HiOutlineCog6Tooth size={20} />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <button onClick={() => { toggleDark(); setShowMore(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <span>{darkMode ? '☀️' : '🌙'}</span>
                  <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <div className="h-px bg-gray-100 dark:bg-white/5" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                >
                  <HiArrowLeftOnRectangle size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Sliding Panels */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
        {isActivityOpen && (
          <ActivityPanel 
            isOpen={isActivityOpen} 
            notifications={notifications} 
            onClose={() => setIsActivityOpen(false)}
            onRead={(id) => {
              setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-[60] flex justify-around items-center h-16 border-t border-gray-100 dark:border-white/5 px-2">
        {navItems.filter(i => i.name !== 'Create' && i.name !== 'Notifications' && i.name !== 'Search').map(item => {
           const Icon = isActive(item.path) ? item.activeIcon : item.icon;
           return (
             <Link key={item.name} to={item.path} className={`p-2 transition-transform active:scale-125 ${isActive(item.path) ? 'text-petverse-purple' : 'text-gray-500'}`}>
               <Icon size={28} />
             </Link>
           );
        })}
        {/* Mobile Create Button in middle */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow -translate-y-4 border-4 border-white dark:border-petverse-dark"
        >
          <HiPlusCircle size={24} />
        </button>
        <Link to={`/profile/${user?._id}`} className={`p-2 ${isActive(`/profile/${user?._id}`) ? 'text-petverse-purple' : 'text-gray-500'}`}>
          {user?.profilePic ? (
            <img src={user.profilePic} className={`w-7 h-7 rounded-full border-2 ${isActive(`/profile/${user?._id}`) ? 'border-petverse-purple' : 'border-transparent'}`} alt="p" />
          ) : (
            <HiOutlineUser size={28} />
          )}
        </Link>
      </nav>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onRefresh={() => window.location.reload()} 
      />
    </>
  );
};

export default Sidebar;
