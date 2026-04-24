import { useState, useEffect } from 'react';
import { HiXMark, HiHeart, HiOutlineHeart, HiChatBubbleOvalLeft, HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { likePost, commentOnPost, savePost } from '../api';
import { useAuth } from '../context/AuthContext';

const PostDetailModal = ({ isOpen, onClose, post: initialPost, onUpdate }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
      setIsLiked(initialPost.likes.includes(user?._id));
      setIsSaved(user?.savedPosts?.includes(initialPost._id));
    }
  }, [initialPost, user?._id]);

  if (!isOpen || !post) return null;

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      const res = await likePost(post._id);
      setPost(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      setIsLiked(isLiked);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await commentOnPost(post._id, commentText);
      setPost(res.data);
      setCommentText('');
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved);
      await savePost(post._id);
    } catch (err) {
      setIsSaved(isSaved);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-petverse-darkCard w-full max-w-6xl md:rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row h-full md:h-[85vh]"
        >
          {/* Close button for mobile */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 text-white rounded-full flex items-center justify-center md:hidden"
          >
            <HiXMark size={24} />
          </button>

          {/* Left: Media Area */}
          <div className="flex-[1.5] bg-black flex items-center justify-center relative group">
            {post.mediaType === 'image' ? (
              <img src={post.mediaUrl} className="max-w-full max-h-full object-contain" alt="post" />
            ) : (
              <video src={post.mediaUrl} controls className="max-w-full max-h-full" />
            )}
          </div>

          {/* Right: Info & Comments */}
          <div className="flex-1 flex flex-col bg-white dark:bg-petverse-darkCard min-w-[350px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3">
                <img src={post.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                <span className="font-bold text-gray-800 dark:text-white">{post.user.username}</span>
              </Link>
              <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-gray-600 transition-colors">
                <HiXMark size={24} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
              {/* Caption as first comment */}
              <div className="flex gap-3">
                <img src={post.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} className="w-8 h-8 rounded-full shrink-0" alt="avatar" />
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-bold mr-2">{post.user.username}</span>
                    {post.caption}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </p>
                </div>
              </div>

              {/* Real Comments */}
              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <img src={comment.user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`} className="w-8 h-8 rounded-full shrink-0" alt="avatar" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-bold mr-2">{comment.user?.username}</span>
                      {comment.text}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">
                       {formatDistanceToNow(new Date(comment.createdAt || Date.now()))} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions & Input */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button onClick={handleLike} className={`transition-transform active:scale-150 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    {isLiked ? <HiHeart size={28} /> : <HiOutlineHeart size={28} />}
                  </button>
                  <button className="text-gray-600 dark:text-gray-300">
                    <HiChatBubbleOvalLeft size={28} />
                  </button>
                </div>
                <button onClick={handleSave} className={isSaved ? 'text-petverse-purple' : 'text-gray-600 dark:text-gray-300'}>
                  {isSaved ? <HiBookmark size={28} /> : <HiOutlineBookmark size={28} />}
                </button>
              </div>
              
              <p className="font-black text-sm text-gray-800 dark:text-white mb-4">{post.likes.length} likes</p>

              <form onSubmit={handleComment} className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim()}
                  className="text-petverse-purple font-bold text-sm disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PostDetailModal;
