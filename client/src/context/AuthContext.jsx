import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('petverse_dark') === 'true';
  });

  useEffect(() => {
    const token = localStorage.getItem('petverse_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('petverse_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('petverse_dark', darkMode);
  }, [darkMode]);

  const loginUser = (userData, token) => {
    localStorage.setItem('petverse_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('petverse_token');
    setUser(null);
  };

  const toggleDark = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loginUser, logout, darkMode, toggleDark }}
    >
      {children}
    </AuthContext.Provider>
  );
};
