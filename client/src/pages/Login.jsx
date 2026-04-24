import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(formData);
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -120, 0],
          x: [0, -150, 0],
          y: [0, -100, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            className="inline-flex w-20 h-20 gradient-primary rounded-3xl items-center justify-center text-white shadow-glow mb-6 cursor-pointer"
          >
            <MdPets size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-display font-black gradient-text tracking-tighter"
          >
            PetVerse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs"
          >
            Join the global pet parent community 🐾
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-strong p-10 rounded-[40px] shadow-glass-2xl border border-white/20 dark:border-white/5"
        >
          <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-8 tracking-tight">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
              <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="woof@petverse.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }} className="relative space-y-2">
              <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petverse-purple transition-colors"
                >
                  {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-2xl border border-red-100 dark:border-red-800"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 shadow-glow-purple text-lg font-black"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entering...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Quick Connect</span>
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/google`;
                }}
                className="flex-1 py-4 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 font-bold text-sm shadow-sm hover:shadow-md transition-all"
              >
                <FaGoogle className="text-red-500 text-lg" />
                <span>Google</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/facebook`;
                }}
                className="flex-1 py-4 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 font-bold text-sm shadow-sm hover:shadow-md transition-all"
              >
                <FaFacebook className="text-blue-600 text-lg" />
                <span>Facebook</span>
              </motion.button>
            </div>
          </form>

          <p className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400 font-medium">
            New to the pack?{' '}
            <Link to="/signup" className="text-petverse-purple font-black hover:underline tracking-tight">
              Create account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
