import { useState, useEffect, useRef } from 'react';
import { HiXMark, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { viewStory } from '../api';

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer = ({ isOpen, onClose, storyGroup, onNextUser, onPrevUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      startProgress();
    } else {
      stopProgress();
    }
    return () => stopProgress();
  }, [isOpen, storyGroup]);

  const startProgress = () => {
    stopProgress();
    setProgress(0);
    const startTime = Date.now();
    
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / STORY_DURATION) * 100;
      
      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    // Track view
    if (storyGroup?.stories[currentIndex]) {
      viewStory(storyGroup.stories[currentIndex]._id);
    }
  };

  const stopProgress = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
  };

  const handleNext = () => {
    if (currentIndex < storyGroup.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      startProgress();
    } else {
      if (onNextUser) onNextUser();
      else onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      startProgress();
    } else {
      if (onPrevUser) onPrevUser();
    }
  };

  if (!isOpen || !storyGroup) return null;

  const currentStory = storyGroup.stories[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-lg h-full md:h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl bg-gray-900 flex flex-col"
        >
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-30">
            {storyGroup.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75" 
                  style={{ width: `${idx < currentIndex ? 100 : idx === currentIndex ? progress : 0}%` }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
            <div className="flex items-center gap-3">
              <img src={storyGroup.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${storyGroup.user.username}`} className="w-10 h-10 rounded-full border-2 border-white pointer-events-auto" alt="avatar" />
              <span className="text-white font-bold pointer-events-auto shadow-sm">{storyGroup.user.username}</span>
            </div>
            <button onClick={onClose} className="text-white hover:scale-110 transition-transform pointer-events-auto">
              <HiXMark size={32} />
            </button>
          </div>

          {/* Navigation Areas */}
          <div className="absolute inset-0 z-20 flex">
            <div className="flex-1 cursor-pointer" onClick={handlePrev} />
            <div className="flex-1 cursor-pointer" onClick={handleNext} />
          </div>

          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center bg-black">
            {currentStory.mediaType === 'video' ? (
              <video 
                src={currentStory.mediaUrl} 
                autoPlay 
                muted 
                playsInline 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img 
                src={currentStory.mediaUrl} 
                className="max-w-full max-h-full object-contain" 
                alt="story content" 
              />
            )}
          </div>

          {/* Footer/Captions could go here */}
        </motion.div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 z-30">
          <button onClick={onPrevUser} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <HiChevronLeft size={32} />
          </button>
        </div>
        <div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 z-30">
          <button onClick={onNextUser} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <HiChevronRight size={32} />
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default StoryViewer;
