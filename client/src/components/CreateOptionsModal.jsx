import { HiPhoto, HiOutlineBolt } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const CreateOptionsModal = ({ isOpen, onClose, onSelectPost, onSelectStory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-petverse-dark w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-white/20 p-8"
      >
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter text-center mb-8">Create New</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onSelectPost(); onClose(); }}
            className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-petverse-purple/10 group transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-petverse-purple flex items-center justify-center text-white shadow-glow-purple group-hover:rotate-12 transition-transform">
              <HiPhoto size={32} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest dark:text-white">Post</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onSelectStory(); onClose(); }}
            className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-petverse-pink/10 group transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-petverse-pink flex items-center justify-center text-white shadow-glow-pink group-hover:rotate-12 transition-transform">
              <HiOutlineBolt size={32} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest dark:text-white">Story</span>
          </motion.button>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default CreateOptionsModal;
