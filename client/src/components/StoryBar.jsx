import { useState, useRef } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { uploadFile, createStory } from '../api';
import { useAuth } from '../context/AuthContext';

const StoryBar = ({ stories, onRefresh, onOpenStory }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await uploadFile(file);
      const mediaUrl = uploadRes.data.url;
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      
      await createStory({ mediaUrl, mediaType });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
      {/* Add Story Button */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-petverse-purple hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all relative group"
        >
          {user?.profilePic ? (
            <img src={user.profilePic} className="w-full h-full rounded-full object-cover p-1" alt="me" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 font-bold">
              {user?.username?.charAt(0)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-petverse-purple rounded-full flex items-center justify-center text-white border-2 border-white dark:border-petverse-dark shadow-md group-hover:scale-110 transition-transform">
            {uploading ? (
               <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <HiPlus size={14} />}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            accept="image/*,video/*" 
            className="hidden" 
          />
        </div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Story</span>
      </div>

      {/* Followed Stories */}
      {stories.map((group) => (
        <div 
          key={group.user._id}
          onClick={() => onOpenStory(group)}
          className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-petverse-purple via-petverse-pink to-petverse-orange group-hover:scale-105 transition-transform active:scale-95">
            <div className="w-full h-full rounded-full bg-white dark:bg-petverse-dark p-0.5">
              <img 
                src={group.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${group.user.username}`} 
                className="w-full h-full rounded-full object-cover" 
                alt="story" 
              />
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest truncate w-16 text-center">
            {group.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
