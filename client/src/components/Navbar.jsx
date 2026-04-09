import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  HiPlusCircle
} from 'react-icons/hi';
import { MdOutlinePets, MdPets } from 'react-icons/md';

const Navbar = () => {
  const { user, toggleDark, darkMode } = useAuth();
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
