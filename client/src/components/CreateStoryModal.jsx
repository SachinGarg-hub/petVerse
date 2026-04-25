import { useState, useRef } from 'react';
import { HiXMark, HiCloudArrowUp } from 'react-icons/hi2';
import { createStory, uploadFile } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const CreateStoryModal = ({ isOpen, onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        return setError('File too large. Max 10MB.');
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please select a photo');
    
    setLoading(true);
    setError('');
    
    try {
      const uploadRes = await uploadFile(file);
      await createStory({
        mediaUrl: uploadRes.data.url,
        mediaType: file.type.startsWith('video') ? 'video' : 'image'
      });
      onRefresh();
      handleClose();
    } catch (err) {
      console.error('Story Upload Error:', err);
      const msg = err.response?.data?.message || err.message || 'Unknown story error';
      setError(`Story Failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-petverse-dark w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white/20"
      >
        <div className="p-6 text-center border-b border-gray-50 dark:border-white/5">
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">New Story</h3>
          <button onClick={handleClose} className="absolute right-6 top-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <HiXMark size={24} />
          </button>
        </div>

        <div className="p-8">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />

          {!previewUrl ? (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[9/16] cursor-pointer border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-petverse-purple hover:bg-petverse-purple/5 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                <HiCloudArrowUp size={32} />
              </div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pick a Pet Pic</p>
            </motion.div>
          ) : (
            <div className="aspect-[9/16] rounded-[32px] overflow-hidden bg-black relative group shadow-xl">
              {file?.type.startsWith('video') ? (
                <video src={previewUrl} className="h-full w-full object-cover" muted autoPlay loop />
              ) : (
                <img src={previewUrl} className="h-full w-full object-cover" alt="story" />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => setPreviewUrl('')} className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <HiXMark size={24} />
                 </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 text-[10px] font-black text-center uppercase tracking-wider"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || !file}
            className="w-full mt-6 py-4 rounded-2xl gradient-primary text-white font-black shadow-glow-purple disabled:opacity-50 disabled:grayscale transition-all"
          >
            {loading ? 'Sharing...' : 'Add to Story'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateStoryModal;
