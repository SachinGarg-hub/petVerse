import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as signupApi } from '../api';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

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
      {/* Decorative blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex w-14 h-14 gradient-primary rounded-2xl items-center justify-center text-white shadow-glow mb-4">
            <MdPets size={30} />
          </div>
          <h1 className="text-3xl font-display font-extrabold gradient-text">PetVerse</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Join the ultimate pet community! 🐾</p>
        </div>

        <div className="glass-strong p-8 rounded-4xl shadow-glass-lg animate-scale-in">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Username</label>
              <input
                type="text"
                name="username"
                required
                placeholder="pet_lover_2024"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
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
                className="absolute right-4 top-[38px] text-gray-400"
              >
                {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm p-4 rounded-xl border border-red-100 dark:border-red-800 animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or join with</span>
              <div className="flex-grow border-t border-gray-100 dark:border-white/5"></div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <FaGoogle className="text-red-500" />
                Google
              </button>
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/facebook'}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <FaFacebook className="text-blue-600" />
                Facebook
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-petverse-purple font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
