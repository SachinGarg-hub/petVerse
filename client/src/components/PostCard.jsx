import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiHeart, 
  HiOutlineHeart, 
  HiChatBubbleOvalLeft, 
  HiBookmark, 
  HiOutlineBookmark,
  HiEllipsisHorizontal
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { likePost, commentOnPost, savePost, getLikers } from '../api';
import { formatDistanceToNow } from 'date-fns';
import UserListModal from './UserListModal';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(user?.savedPosts?.includes(post._id));
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likers, setLikers] = useState([]);
  const [loadingLikers, setLoadingLikers] = useState(false);

  const fetchLikers = async () => {
    setIsLikersModalOpen(true);
    setLoadingLikers(true);
    try {
      const res = await getLikers(post._id);
      setLikers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLikers(false);
    }
  };

  const handleLike = async () => {
    try {
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 600);
      
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      const res = await likePost(post._id);
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await commentOnPost(post._id, commentText);
      onUpdate(res.data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved);
      await savePost(post._id);
    } catch (err) {
      console.error(err);
      setIsSaved(isSaved);
    }
  };

  return (
    <div className="card mb-6 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3">
          {post.user.profilePic ? (
            <img src={post.user.profilePic} alt={post.user.username} className="w-10 h-10 rounded-full object-cover border-2 border-petverse-purple/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {post.user.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white leading-tight">{post.user.username}</h3>
            <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
          </div>
        </Link>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <HiEllipsisHorizontal size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="relative group" onDoubleClick={handleLike}>
        {post.mediaType === 'image' ? (
          <img src={post.mediaUrl} alt="post content" className="w-full aspect-square object-cover" />
        ) : (
          <video src={post.mediaUrl} controls className="w-full aspect-square object-cover" />
        )}
        
        {/* Double click heart animation */}
        {likeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <HiHeart className="text-white drop-shadow-lg scale-[4] animate-heart-beat" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`transition-transform active:scale-150 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {isLiked ? <HiHeart size={30} className="like-animation" /> : <HiOutlineHeart size={30} />}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="text-gray-600 dark:text-gray-300">
              <HiChatBubbleOvalLeft size={30} />
            </button>
          </div>
          <button onClick={handleSave} className={isSaved ? 'text-petverse-purple' : 'text-gray-600 dark:text-gray-300'}>
            {isSaved ? <HiBookmark size={30} /> : <HiOutlineBookmark size={30} />}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <button 
            onClick={fetchLikers}
            className="font-bold text-gray-800 dark:text-white text-left hover:underline cursor-pointer"
          >
            {likesCount} likes
          </button>
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-bold mr-2">{post.user.username}</span>
            {post.caption}
          </div>
          {post.comments.length > 0 && (
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-gray-400 text-sm mt-1 text-left hover:underline"
            >
              View all {post.comments.length} comments
            </button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-3 animate-fade-in max-h-60 overflow-y-auto hide-scrollbar">
            {post.comments.map((comment, idx) => (
              <div key={idx} className="flex gap-2 text-sm">
                <span className="font-bold text-gray-800 dark:text-white shrink-0">{comment.user?.username}</span>
                <span className="text-gray-600 dark:text-gray-400">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none"
          />
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            className="text-petverse-purple font-bold text-sm disabled:opacity-50 hover:text-petverse-pink transition-colors"
          >
            Post
          </button>
        </form>
      </div>
      
      <UserListModal 
        isOpen={isLikersModalOpen}
        onClose={() => setIsLikersModalOpen(false)}
        title="Likes"
        users={likers}
        loading={loadingLikers}
      />
    </div>
  );
};

export default PostCard;
