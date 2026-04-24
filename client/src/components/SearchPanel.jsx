import { useState, useEffect } from 'react';
import { searchUsers } from '../api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const SearchPanel = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const res = await searchUsers(query);
          setResults(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed left-20 lg:left-64 top-0 bottom-0 w-80 lg:w-96 bg-white dark:bg-petverse-dark border-r border-gray-100 dark:border-white/5 z-[55] shadow-2xl flex flex-col"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Search</h2>
          <button onClick={onClose} className="md:hidden">
            <HiXMark size={24} />
          </button>
        </div>
        
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-petverse-purple/50 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
          {loading ? (
            <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-2 border-petverse-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            results.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <img 
                  src={u.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                  className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform" 
                  alt={u.username} 
                />
                <div>
                  <p className="font-bold text-gray-800 dark:text-white leading-tight">{u.username}</p>
                  <p className="text-xs text-gray-400 font-medium">Pet lover 🐾</p>
                </div>
              </Link>
            ))
          ) : query.length > 1 ? (
            <p className="text-center text-gray-400 py-10 text-sm italic">No users found for "{query}"</p>
          ) : (
            <div className="py-10 text-center">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Recent Searches</p>
               <p className="text-xs text-gray-400 italic">Try searching for your pet buddies!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPanel;
