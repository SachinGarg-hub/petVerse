import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as signupApi } from '../api';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
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
    if (formData.username.length < 3) {
        return setError('Username must be at least 3 characters long.');
    }
    if (formData.password.length < 6) {
        return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await signupApi({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, -50, 0],
          x: [0, 30, 0],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[10%] right-[10%] w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -40, 0],
          rotate: [0, -30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="inline-flex w-16 h-16 gradient-primary rounded-2xl items-center justify-center text-white shadow-glow mb-4 cursor-pointer"
          >
            <MdPets size={32} />
          </motion.div>
          <h1 className="text-4xl font-display font-black gradient-text tracking-tighter">Join PetVerse</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Your pet's social life starts here 🐾</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-strong p-8 rounded-[40px] shadow-glass-2xl border border-white/20 dark:border-white/5"
        >
          <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 tracking-tight">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="cool_cat_24"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="meow@petverse.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 relative">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-petverse-purple focus:ring-0 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-500 text-[10px] font-black p-3 rounded-2xl border border-red-100 dark:border-red-800 uppercase tracking-wider"
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
              className="btn-primary w-full py-4 mt-2 font-black shadow-glow-purple"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Sign Up Now'
              )}
            </motion.button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">Or join with</span>
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ y: -2 }}
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/google`;
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:shadow-md transition-all"
              >
                <FaGoogle className="text-red-500" />
                Google
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/facebook`;
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:shadow-md transition-all"
              >
                <FaFacebook className="text-blue-600" />
                Facebook
              </motion.button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Member already?{' '}
            <Link to="/login" className="text-petverse-purple font-black hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
