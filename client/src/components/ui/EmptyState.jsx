import { motion } from 'framer-motion';
import { MdOutlineInbox } from 'react-icons/md';

const EmptyState = ({ title, message, icon: Icon = MdOutlineInbox, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">{message}</p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
