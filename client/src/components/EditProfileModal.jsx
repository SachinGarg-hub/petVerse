import { useState, useRef } from 'react';
import { HiXMark, HiOutlineCamera, HiOutlineUser, HiOutlineInformationCircle } from 'react-icons/hi2';
import { updateProfile, uploadFile } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image')) {
        return setError('Please select an image file');
      }
      setFile(selectedFile);
      setFormData({ ...formData, profilePic: URL.createObjectURL(selectedFile) });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalProfilePic = formData.profilePic;

      // 1. Upload new image if selected
      if (file) {
        const uploadRes = await uploadFile(file);
        finalProfilePic = uploadRes.data.url;
      }

      // 2. Update profile
      const res = await updateProfile({
        ...formData,
        profilePic: finalProfilePic
      });

      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="card w-full max-w-md rounded-4xl shadow-2xl overflow-hidden relative z-10 p-0"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Profile</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <HiXMark size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Profile Pic Section */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <img 
                    src={formData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-petverse-dark shadow-lg transition-transform group-hover:scale-105" 
                    alt="preview" 
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <HiOutlineCamera size={24} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to change photo</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    <HiOutlineUser size={14} />
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field"
                    placeholder="Username"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    <HiOutlineInformationCircle size={14} />
                    Bio
                  </label>
                  <textarea
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tell the world about you and your pets..."
                    maxLength={200}
                  />
                  <p className="text-[10px] text-right text-gray-400 mt-1">{formData.bio.length}/200</p>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
