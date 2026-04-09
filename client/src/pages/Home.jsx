import { useState, useEffect } from 'react';
import { getPosts, getSuggestedUsers, followUser } from '../api';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { HiPlus, HiSparkles } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedType, setFeedType] = useState('for-you');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (p = 1, type = feedType) => {
    try {
      const res = await getPosts(p, type === 'following' ? 'following' : '');
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts([...posts, ...res.data.posts]);
      }
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      const res = await getSuggestedUsers();
      setSuggested(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts(1, feedType);
    if (suggested.length === 0) fetchSuggested();
  }, [feedType]);

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleFollow = async (id) => {
    try {
      await followUser(id);
      fetchSuggested(); // Refresh suggestions
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Feed */}
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Create Post Header */}
        <div className="card p-4 mb-8 flex items-center gap-4 animate-fade-in">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="me" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 text-left px-5 py-3 rounded-2xl transition-all"
          >
            What's your pet up to today? 🐾
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <HiPlus size={24} />
          </button>
        </div>

        {/* Feed Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-100 dark:border-white/5">
          <button 
            onClick={() => { setFeedType('for-you'); setPage(1); setLoading(true); setPosts([]); }}
            className={`px-8 py-4 flex flex-col items-center gap-1 font-bold text-sm transition-all border-b-2 ${feedType === 'for-you' ? 'border-petverse-purple text-petverse-purple' : 'border-transparent text-gray-400'}`}
          >
            FOR YOU
          </button>
          <button 
            onClick={() => { setFeedType('following'); setPage(1); setLoading(true); setPosts([]); }}
            className={`px-8 py-4 flex flex-col items-center gap-1 font-bold text-sm transition-all border-b-2 ${feedType === 'following' ? 'border-petverse-purple text-petverse-purple' : 'border-transparent text-gray-400'}`}
          >
            FOLLOWING
          </button>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card h-[500px] animate-pulse-slow p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-white/10 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post._id} post={post} onUpdate={handleUpdatePost} />
              ))
            ) : (
              <div className="text-center py-20 px-4 card">
                <div className="inline-flex w-20 h-20 bg-purple-50 dark:bg-purple-900/10 rounded-full items-center justify-center text-petverse-purple mb-6 animate-bounce">
                  <HiSparkles size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Feed is quiet...</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start following pet owners to see their posts!</p>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  Share the first post
                </button>
              </div>
            )}

            {hasMore && posts.length > 0 && (
              <button 
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchPosts(nextPage);
                }}
                className="w-full py-4 text-petverse-purple font-bold hover:underline"
              >
                Load more paw-some posts
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Suggestions */}
      <div className="hidden lg:block w-80 space-y-6 shrink-0">
        <div className="card p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white">Suggested for you</h3>
            <Link to="/explore" className="text-xs font-bold text-petverse-purple hover:underline">See All</Link>
          </div>

          <div className="space-y-4">
            {suggested.map(item => (
              <div key={item._id} className="flex items-center justify-between gap-3">
                <Link to={`/profile/${item._id}`} className="flex items-center gap-3">
                  {item.profilePic ? (
                    <img src={item.profilePic} alt={item.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-bold text-gray-800 dark:text-white leading-none">{item.username}</p>
                    <p className="text-gray-400 truncate w-32">New to PetVerse</p>
                  </div>
                </Link>
                <button 
                  onClick={() => handleFollow(item._id)}
                  className="text-xs font-bold text-petverse-purple hover:text-petverse-pink transition-colors"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white shadow-glow">
                <HiSparkles size={24} />
              </div>
              <div className="text-sm">
                <p className="font-bold dark:text-white">Premium Ads</p>
                <p className="text-gray-400">Support PetVerse</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => fetchPosts(1)} 
      />
    </div>
  );
};

export default Home;
