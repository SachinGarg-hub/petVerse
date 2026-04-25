import { useState, useRef } from 'react';
import { HiXMark, HiPhoto, HiVideoCamera, HiCloudArrowUp } from 'react-icons/hi2';
import { createPost, uploadFile } from '../api';

const CreatePostModal = ({ isOpen, onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Auto-detect media type
      setMediaType(selectedFile.type.startsWith('video') ? 'video' : 'image');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image or video to share');
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Upload file to Cloudinary via our server
      let mediaUrl;
      try {
        const uploadRes = await uploadFile(file);
        mediaUrl = uploadRes.data.url;
      } catch (uploadErr) {
        console.error('File Upload Step Failed:', uploadErr);
        throw new Error(`File upload failed: ${uploadErr.response?.data?.message || uploadErr.message}`);
      }

      // 2. Create the post with the uploaded URL
      try {
        await createPost({
          mediaUrl,
          mediaType,
          caption
        });
      } catch (postErr) {
        console.error('Post Creation Step Failed:', postErr);
        throw new Error(`Post creation failed: ${postErr.response?.data?.message || postErr.message}`);
      }

      onRefresh();
      handleClose();
    } catch (err) {
      setError(err.message);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" 
        onClick={handleClose} 
      />
      
      <div className="glass-strong w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-scale-in relative z-10">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Post</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <HiXMark size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />

          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center gap-4 hover:border-petverse-purple hover:bg-petverse-purple/5 transition-all"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-petverse-purple group-hover:scale-110 transition-all">
                <HiCloudArrowUp size={48} />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-700 dark:text-white">Click to upload media</p>
                <p className="text-sm text-gray-400 mt-1">Photos or videos of your pets</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-black flex items-center justify-center shadow-lg group">
              {mediaType === 'image' ? (
                <img src={previewUrl} alt="preview" className="max-h-full object-contain" />
              ) : (
                <video src={previewUrl} className="max-h-full" controls />
              )}
              <button 
                type="button"
                onClick={() => setPreviewUrl('')}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HiXMark size={24} />
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Caption</label>
            <textarea
              rows="3"
              placeholder="What's your pet up to? ✨🐾"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="input-field resize-none"
              maxLength={1000}
            />
            <div className="text-[10px] text-right text-gray-400 mt-1">
              {caption.length}/1000
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className={`btn-primary w-full py-4 text-lg shadow-glow ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sharing with the pack...</span>
              </div>
            ) : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
