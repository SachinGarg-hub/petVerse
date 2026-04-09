import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('petverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Upload
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Posts
export const getPosts = (page = 1) => API.get(`/posts?page=${page}&limit=10`);
export const createPost = (data) => API.post('/posts', data);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const commentOnPost = (id, text) => API.post(`/posts/${id}/comment`, { text });
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const savePost = (id) => API.put(`/posts/${id}/save`);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);

// Reels
export const getReels = (page = 1) => API.get(`/reels?page=${page}&limit=5`);
export const createReel = (data) => API.post('/reels', data);
export const likeReel = (id) => API.put(`/reels/${id}/like`);
export const commentOnReel = (id, text) => API.post(`/reels/${id}/comment`, { text });
export const addView = (id) => API.put(`/reels/${id}/view`);

// Adoption
export const getAdoptions = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return API.get(`/adoption?${params}`);
};
export const createAdoption = (data) => API.post('/adoption', data);
export const getAdoptionById = (id) => API.get(`/adoption/${id}`);
export const deleteAdoption = (id) => API.delete(`/adoption/${id}`);
export const markAdopted = (id) => API.put(`/adoption/${id}/adopt`);

// Users
export const getUser = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);
export const followUser = (id) => API.put(`/users/${id}/follow`);
export const searchUsers = (q) => API.get(`/users/search?q=${q}`);
export const getSuggestedUsers = () => API.get('/users/suggested');

// Messages
export const createConversation = (receiverId) => API.post('/messages/conversations', { receiverId });
export const getConversations = () => API.get('/messages/conversations');
export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = (conversationId) => API.get(`/messages/${conversationId}`);

export default API;
