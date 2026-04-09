import { useState, useEffect, useRef } from 'react';
import { getReels, likeReel, commentOnReel, addView } from '../api';
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
    <div className="reel-item h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] w-full max-w-[400px] mx-auto relative rounded-4xl overflow-hidden bg-black shadow-2xl">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Buttons Overlay */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center z-10">
        <div className="flex flex-col items-center">
          <button onClick={handleLike} className={`p-3 rounded-full glass backdrop-blur-md transition-transform active:scale-150 ${isLiked ? 'text-red-500' : 'text-white'}`}>
            <HiHeart size={30} />
          </button>
          <span className="text-white text-xs font-bold mt-1">{likesCount}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="p-3 rounded-full glass backdrop-blur-md text-white">
            <HiChatBubbleOvalLeft size={30} />
          </button>
          <span className="text-white text-xs font-bold mt-1">{reel.comments.length}</span>
        </div>

        <button className="p-3 rounded-full glass backdrop-blur-md text-white">
          <HiShare size={30} />
        </button>

        <button onClick={() => setMuted(!muted)} className="p-3 rounded-full glass backdrop-blur-md text-white">
          {muted ? <HiSpeakerXMark size={30} /> : <HiSpeakerWave size={30} />}
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-6 left-6 right-16 text-white z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-3 pointer-events-auto">
          <Link to={`/profile/${reel.user._id}`} className="flex items-center gap-2">
            <img src={reel.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reel.user.username}`} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            <span className="font-bold">{reel.user.username}</span>
          </Link>
          <button className="px-4 py-1.5 rounded-full border border-white text-xs font-bold hover:bg-white hover:text-black transition-all">Follow</button>
        </div>
        <p className="text-sm line-clamp-2 leading-relaxed">{reel.caption}</p>
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
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[400px] mb-6">
        <h2 className="text-2xl font-extrabold gradient-text font-display">Reels</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-full glass border border-petverse-purple flex items-center justify-center text-petverse-purple hover:bg-petverse-purple hover:text-white transition-all shadow-glow hover:scale-110 active:scale-95"
        >
          <HiPlus size={24} />
        </button>
      </div>

      {loading ? (
        <div className="h-[calc(100vh-160px)] w-full max-w-[400px] bg-gray-200 dark:bg-white/5 rounded-4xl animate-pulse-slow" />
      ) : (
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="reel-container h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] w-full overflow-y-scroll hide-scrollbar space-y-4"
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

      <CreateReelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => fetchReels()}
      />
    </div>
  );
};

export default Reels;
