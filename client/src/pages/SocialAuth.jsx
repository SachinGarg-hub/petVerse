import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api';

const SocialAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('petverse_token', token);
      getMe()
        .then((res) => {
          loginUser(res.data, token);
          navigate('/');
        })
        .catch((err) => {
          console.error('Social auth failed:', err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [location, navigate, loginUser]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-petverse-purple border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Authenticating with PetVerse...</h2>
        <p className="text-gray-500">Almost there! 🐾</p>
      </div>
    </div>
  );
};

export default SocialAuth;
