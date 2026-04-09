import { useState, useRef } from 'react';
import { HiXMark, HiVideoCamera, HiCloudArrowUp } from 'react-icons/hi2';
import { createReel, uploadFile } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const CreateReelModal = ({ isOpen, onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video')) {
        return setError('Please select a video file for Reels');
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a pet video to share');
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Upload video to Cloudinary via our server
      const uploadRes = await uploadFile(file);
      const videoUrl = uploadRes.data.url;

      // 2. Create the reel with the uploaded URL
      await createReel({
        videoUrl,
        caption
      });

      onRefresh();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to share reel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFile(null);
    setPreviewUrl('');
    setCaption('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={handleClose} 
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white/20"
          >
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                   <HiVideoCamera size={24} />
                </div>
                Post a Reel
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                <HiXMark size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />

              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center gap-4 hover:border-petverse-purple hover:bg-petverse-purple/5 transition-all text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-petverse-purple group-hover:scale-110 transition-all">
                    <HiCloudArrowUp size={48} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Upload Vertical Video</p>
                    <p className="text-sm text-gray-500 mt-1">MP4 or MOV preferred</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden aspect-[9/16] max-h-[350px] bg-black flex items-center justify-center border border-white/10 group">
                  <video 
                    src={previewUrl} 
                    className="h-full object-contain" 
                    autoPlay 
                    muted 
                    loop 
                  />
                  <button 
                    type="button"
                    onClick={() => setPreviewUrl('')}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiXMark size={24} />
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Caption</label>
                <textarea
                  rows="3"
                  placeholder="What's the story behind this video? ✨"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="input-field bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-petverse-purple transition-all p-4 rounded-2xl w-full resize-none"
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm font-bold text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-5 rounded-3xl gradient-primary text-white font-black text-lg shadow-glow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading Reel...</span>
                  </div>
                ) : (
                  'Share Reel 🎬'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateReelModal;
