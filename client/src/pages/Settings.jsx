import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineBell, HiOutlineShieldCheck, HiOutlineEye } from 'react-icons/hi2';

const Settings = () => {
  const { user, toggleDark, darkMode } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', name: 'Account', icon: HiOutlineUser },
    { id: 'privacy', name: 'Privacy', icon: HiOutlineEye },
    { id: 'security', name: 'Security', icon: HiOutlineLockClosed },
    { id: 'notifications', name: 'Notifications', icon: HiOutlineBell },
    { id: 'help', name: 'Help', icon: HiOutlineShieldCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-8 uppercase tracking-tighter">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-petverse-purple text-white shadow-glow' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 card p-8 min-h-[500px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'account' && (
              <div className="space-y-8">
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <img src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} className="w-16 h-16 rounded-full object-cover border-2 border-white" alt="p" />
                    <div>
                      <p className="font-bold dark:text-white">{user?.username}</p>
                      <button className="text-xs font-black text-petverse-purple uppercase hover:underline">Change profile photo</button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</span>
                      <input type="text" defaultValue={user?.username} className="mt-1 block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</span>
                      <input type="email" defaultValue={user?.email} className="mt-1 block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium" />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                  <h4 className="font-bold dark:text-white mb-4">Appearance</h4>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <span className="text-sm font-medium">Dark Mode</span>
                    <button 
                      onClick={toggleDark}
                      className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-petverse-purple' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <button className="btn-primary w-full py-4 mt-4">Save Changes</button>
              </div>
            )}

            {activeTab !== 'account' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                    <HiOutlineCog6Tooth size={32} />
                 </div>
                 <h3 className="font-bold dark:text-white">Under Construction</h3>
                 <p className="text-sm text-gray-500">We're working hard to bring you more settings! 🐾</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
