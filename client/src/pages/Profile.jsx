import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserPosts, followUser, createConversation } from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUserAdd, HiOutlineMail, HiOutlineCheckCircle, HiOutlineViewGrid, HiOutlineBookmark } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import UserListModal from '../components/UserListModal';
import PostDetailModal from '../components/PostDetailModal';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          getUser(id),
          getUserPosts(id)
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
        setIsFollowing(userRes.data.followers.some(f => f._id === currentUser?._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser?._id]);

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      setUser(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(f => f._id !== currentUser?._id)
          : [...prev.followers, { _id: currentUser?._id }]
      }));
      await followUser(id);
    } catch (err) {
      setIsFollowing(isFollowing);
      // Revert if error
      setUser(prev => ({
        ...prev,
        followers: !isFollowing 
          ? prev.followers.filter(f => f._id !== currentUser?._id)
          : [...prev.followers, { _id: currentUser?._id }]
      }));
    }
  };

  const handleMessage = async () => {
    try {
      await createConversation(id);
      navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-petverse-purple border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Fetching profile...</p>
    </div>
  );

  const isMyProfile = currentUser?._id === id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="card p-8 md:p-12 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 right-0 h-32 gradient-cool opacity-20" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative">
            <img 
              src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-white dark:border-petverse-darkCard shadow-glass-lg" 
              alt="profile" 
            />
            {isMyProfile && (
               <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-petverse-dark shadow-md rounded-full flex items-center justify-center text-petverse-purple hover:scale-110 transition-transform"
               >
                  ✏️
               </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-3xl font-display font-extrabold text-gray-800 dark:text-white">{user?.username}</h1>
              <div className="flex gap-2">
                {!isMyProfile ? (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`btn-primary px-8 py-2 text-sm ${isFollowing ? 'from-gray-400 to-gray-500' : ''}`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="btn-outline px-6 py-2 text-sm flex items-center gap-2"
                    >
                      <HiOutlineMail size={18} />
                      Message
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn-outline px-8 py-2 text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold text-gray-800 dark:text-white uppercase tracking-tighter">{posts.length}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Posts</span>
              </div>
              <button 
                onClick={() => {
                  setModalTitle('Followers');
                  setModalUsers(user?.followers || []);
                  setIsUserListModalOpen(true);
                }}
                className="text-center md:text-left hover:scale-105 transition-transform"
              >
                <span className="block text-xl font-extrabold text-gray-800 dark:text-white uppercase tracking-tighter">{user?.followers.length}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Followers</span>
              </button>
              <button 
                onClick={() => {
                  setModalTitle('Following');
                  setModalUsers(user?.following || []);
                  setIsUserListModalOpen(true);
                }}
                className="text-center md:text-left hover:scale-105 transition-transform"
              >
                <span className="block text-xl font-extrabold text-gray-800 dark:text-white uppercase tracking-tighter">{user?.following.length}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Following</span>
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 font-medium max-w-md">
              {user?.bio || `Animal lover. Welcome to my ${user?.username}'s PetVerse! ✨🐾`}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex justify-center border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={() => setTab('posts')}
          className={`px-8 py-4 flex items-center gap-2 font-bold text-sm transition-all border-b-2 ${tab === 'posts' ? 'border-petverse-purple text-petverse-purple' : 'border-transparent text-gray-400'}`}
        >
          <HiOutlineViewGrid size={20} />
          POSTS
        </button>
        <button 
          onClick={() => setTab('saved')}
          className={`px-8 py-4 flex items-center gap-2 font-bold text-sm transition-all border-b-2 ${tab === 'saved' ? 'border-petverse-purple text-petverse-purple' : 'border-transparent text-gray-400'}`}
        >
          <HiOutlineBookmark size={20} />
          SAVED
        </button>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        {tab === 'posts' ? (
          <>
            {posts.length > 0 ? (
              posts.map(post => (
                <div 
                  key={post._id} 
                  onClick={() => {
                    setSelectedPost(post);
                    setIsPostModalOpen(true);
                  }}
                  className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
                >
                  <img src={post.mediaUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="post" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-6">
                     <span className="flex items-center gap-1 text-lg">❤️ {post.likes.length}</span>
                     <span className="flex items-center gap-1 text-lg">💬 {post.comments.length}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center card">
                <h3 className="text-xl font-bold dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-500">When you share pet photos, they'll appear here!</p>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-full py-20 text-center card">
            <h3 className="text-xl font-bold dark:text-white mb-2">Nothing saved yet</h3>
            <p className="text-gray-500">Save posts you love to see them here.</p>
          </div>
        )}
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <UserListModal 
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        title={modalTitle}
        users={modalUsers}
      />

      <PostDetailModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        post={selectedPost}
        onUpdate={(updatedPost) => {
          setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
        }}
      />
    </div>
  );
};

export default Profile;
