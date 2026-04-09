import { useState, useEffect } from 'react';
import { searchUsers, getPosts, getSuggestedUsers } from '../api';
import { HiSearch, HiOutlineViewGrid } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExploreData = async () => {
    try {
      const [postsRes, suggestedRes] = await Promise.all([
        getPosts(1),
        getSuggestedUsers()
      ]);
      setExplorePosts(postsRes.data.posts);
      setSuggestedUsers(suggestedRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim().length > 1) {
      try {
        const res = await searchUsers(query);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative group">
        <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-petverse-purple transition-colors" size={24} />
        <input
          type="text"
          placeholder="Search pet lovers, breeds, or locations..."
          value={searchTerm}
          onChange={handleSearch}
          className="input-field pl-14 py-4 text-lg shadow-glass h-16"
        />
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-20 left-0 right-0 glass-strong rounded-3xl shadow-glass-lg z-20 overflow-hidden border border-gray-100 dark:border-white/10">
            {searchResults.map(user => (
              <Link key={user._id} to={`/profile/${user._id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.bio || 'New member'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories / Tags */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
        {['#GoldenRetriever', '#CatLife', '#PuppyLove', '#Hamsters', '#Adoption', '#BirdLovers'].map(tag => (
          <button key={tag} className="px-6 py-2 rounded-full glass border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-petverse-purple hover:text-petverse-purple whitespace-nowrap transition-all">
            {tag}
          </button>
        ))}
      </div>

      {/* Suggested Users */}
      {suggestedUsers.length > 0 && !searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl font-bold dark:text-white mb-4">Suggested Pet Lovers</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
            {suggestedUsers.map(user => (
              <Link key={user._id} to={`/profile/${user._id}`} className="card min-w-[200px] p-6 flex flex-col items-center text-center hover:border-petverse-purple transition-colors">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username} className="w-16 h-16 rounded-full object-cover mb-3" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl mb-3">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="font-bold text-gray-800 dark:text-white mb-1">{user.username}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{user.bio || 'New to PetVerse'}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Explore Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HiOutlineViewGrid size={24} className="text-petverse-purple" />
          <h2 className="text-2xl font-bold dark:text-white">Discover</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse-slow" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
            {explorePosts.map((post, index) => (
              <Link 
                key={post._id} 
                to={`/`} // Simple link to Home for now
                className={`group relative aspect-square overflow-hidden rounded-2xl md:rounded-4xl transition-transform hover:scale-[1.02] ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img src={post.mediaUrl} alt="explore" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-6 font-bold">
                  <div className="flex items-center gap-2">
                    <span>❤️</span> {post.likes.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💬</span> {post.comments.length}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
