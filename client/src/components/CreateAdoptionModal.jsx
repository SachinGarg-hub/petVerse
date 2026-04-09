import { useState, useRef } from 'react';
import { HiXMark, HiOutlineCamera, HiOutlineInformationCircle } from 'react-icons/hi2';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { MdOutlinePets } from 'react-icons/md';
import { createAdoption, uploadFile } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const CreateAdoptionModal = ({ isOpen, onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'Dog',
    breed: '',
    age: 'Young',
    gender: 'Male',
    location: '',
    description: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
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
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload a photo of the pet');

    setLoading(true);
    setError('');

    try {
      // 1. Upload image to Cloudinary
      const uploadRes = await uploadFile(file);
      const imageUrl = uploadRes.data.url;

      // 2. Create Adoption Listing
      await createAdoption({
        ...formData,
        imageUrl
      });

      onRefresh();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl('');
    setFormData({
      petName: '',
      petType: 'Dog',
      breed: '',
      age: 'Young',
      gender: 'Male',
      location: '',
      description: '',
      contactEmail: '',
      contactPhone: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={handleClose} 
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="glass-strong w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden relative z-10 m-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-petverse-purple/10 flex items-center justify-center text-petverse-purple">
                 <MdOutlinePets size={24} />
              </div>
              Post Adoption Listing
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <HiXMark size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Pet Photo</label>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-10 flex flex-col items-center gap-4 hover:border-petverse-purple hover:bg-petverse-purple/5 transition-all text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                    <HiOutlineCamera size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 dark:text-white">Click to upload pet photo</p>
                    <p className="text-sm text-gray-400 mt-1">Clear photos help pets find homes faster!</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden aspect-video bg-black flex items-center justify-center shadow-lg group">
                  <img src={previewUrl} alt="pet" className="max-h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => { setFile(null); setPreviewUrl(''); }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiXMark size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Pet Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buddy"
                  className="input-field"
                  value={formData.petName}
                  onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Pet Type
                </label>
                <select
                  required
                  className="input-field appearance-none"
                  value={formData.petType}
                  onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                >
                  {['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Breed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Golden Retriever"
                  className="input-field"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Age
                </label>
                <select
                  required
                  className="input-field appearance-none"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                >
                  {['Puppy/Kitten', 'Young', 'Adult', 'Senior'].map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Gender
                </label>
                <div className="flex gap-4">
                  {['Male', 'Female'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-3 rounded-2xl font-bold transition-all ${formData.gender === g ? 'bg-petverse-purple text-white shadow-glow' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  <HiOutlineLocationMarker />
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Los Angeles, CA"
                  className="input-field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                <HiOutlineInformationCircle />
                Pet Story & Personality
              </label>
              <textarea
                rows="4"
                required
                placeholder="Tell us about the pet's history, health status, and personality..."
                className="input-field resize-none p-4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  <HiOutlineMail />
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. foster@example.com"
                  className="input-field"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 234 567 890"
                  className="input-field"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold text-center py-2 bg-red-50 dark:bg-red-900/10 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-lg shadow-glow-lg transition-transform hover:scale-[1.01] active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Listing...</span>
                </div>
              ) : 'Publish Adoption Listing 🐾'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateAdoptionModal;
