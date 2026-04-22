import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

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
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex w-16 h-16 gradient-primary rounded-2xl items-center justify-center text-white shadow-glow mb-4">
            <MdPets size={36} />
          </div>
          <h1 className="text-4xl font-display font-extrabold gradient-text">PetVerse</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Welcome back, pet lover! 🐾</p>
        </div>

        <div className="glass-strong p-8 rounded-4xl shadow-glass-lg animate-scale-in">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="hello@petverse.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-petverse-purple transition-colors"
              >
                {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm p-4 rounded-xl border border-red-100 dark:border-red-800 animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await loginApi({ email: 'demo@petverse.com', password: 'Demo@1234' });
                  loginUser(res.data.user, res.data.token);
                  navigate('/');
                } catch (err) {
                  setError('Demo login failed. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full mt-4 py-3 px-4 rounded-2xl bg-white/5 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
            >
              <MdPets className="animate-pulse" />
              Login as Demo User
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/google`;
                }}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <FaGoogle className="text-red-500" />
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  window.location.href = `${apiUrl}/api/auth/facebook`;
                }}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <FaFacebook className="text-blue-600" />
                Facebook
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-petverse-purple font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
