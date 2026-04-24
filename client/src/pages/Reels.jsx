import { useState, useEffect, useRef } from 'react';
import { getReels, likeReel, addView } from '../api';
import { HiHeart, HiChatBubbleOvalLeft, HiShare, HiSpeakerWave, HiSpeakerXMark, HiPlus } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateReelModal from '../components/CreateReelModal';

const ReelCard = ({ reel, isActive }) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(reel.likes.includes(user?._id));
  const [muted, setMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(reel.likes.length);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      addView(reel._id);
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive, reel._id]);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
      await likeReel(reel._id);
    } catch (err) {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }
  };

  return (
    <div className="snap-start relative h-screen md:h-[calc(100vh-80px)] w-full md:max-w-[400px] md:mx-auto md:rounded-3xl overflow-hidden bg-black shadow-2xl">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={() => setMuted(!muted)}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Buttons Overlay */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-10">
        <div className="flex flex-col items-center">
          <button onClick={handleLike} className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-transform active:scale-150 ${isLiked ? 'text-red-500' : 'text-white'}`}>
            <HiHeart size={28} />
          </button>
          <span className="text-white text-xs font-black mt-1 shadow-sm">{likesCount}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white">
            <HiChatBubbleOvalLeft size={28} />
          </button>
          <span className="text-white text-xs font-black mt-1 shadow-sm">{reel.comments.length}</span>
        </div>

        <button className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white">
          <HiShare size={28} />
        </button>

        <button onClick={() => setMuted(!muted)} className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white">
          {muted ? <HiSpeakerXMark size={28} /> : <HiSpeakerWave size={28} />}
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-10 left-6 right-16 text-white z-10">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/profile/${reel.user._id}`} className="flex items-center gap-2 group">
            <img 
              src={reel.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reel.user.username}`} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border-2 border-white group-hover:scale-110 transition-transform" 
            />
            <span className="font-bold text-lg drop-shadow-md">{reel.user.username}</span>
          </Link>
          <button className="px-4 py-1 rounded-full border border-white/50 bg-white/10 backdrop-blur-sm text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Follow
          </button>
        </div>
        <p className="text-sm font-medium leading-relaxed line-clamp-2 drop-shadow-sm max-w-[85%]">
          {reel.caption}
        </p>
      </div>
    </div>
  );
};

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchReels = async () => {
    try {
      const res = await getReels(1);
      setReels(res.data.reels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="h-screen md:h-[calc(100vh-40px)] w-full flex flex-col items-center">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent">
        <h2 className="text-2xl font-black text-white italic tracking-tighter">Reels</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
        >
          <HiPlus size={24} />
        </button>
      </div>

      {loading ? (
        <div className="h-full w-full max-w-[400px] bg-gray-900 md:rounded-3xl animate-pulse" />
      ) : (
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar md:pb-10"
        >
          {reels.map((reel, idx) => (
            <ReelCard key={reel._id} reel={reel} isActive={idx === activeIndex} />
          ))}
          
          {reels.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <span className="text-6xl mb-4">🎬</span>
              <h3 className="text-xl font-bold dark:text-white">No reels yet!</h3>
              <p className="text-gray-500">Be the first to share a short pet video!</p>
            </div>
          )}
        </div>
      )}

      {/* Desktop Create Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="hidden md:flex fixed right-10 bottom-10 w-14 h-14 rounded-full gradient-primary items-center justify-center text-white shadow-glow hover:scale-110 active:scale-95 transition-all z-50"
      >
        <HiPlus size={28} />
      </button>

      <CreateReelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => fetchReels()}
      />
    </div>
  );
};

export default Reels;
