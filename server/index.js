const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS — fixes ISP SRV-record blocking for MongoDB Atlas

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const passport = require('passport');
require('./config/passport');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const reelRoutes = require('./routes/reels');
const adoptionRoutes = require('./routes/adoption');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notifications');
const storyRoutes = require('./routes/story');

const allowedOrigins = [
  'http://localhost:5173',
  'https://pet-verse-seven.vercel.app',
  'https://pet-verse-seven-sachins-projects-795be7f9.vercel.app', // Vercel preview
  'https://petverse-client.vercel.app'
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Socket.io for real-time chat
const onlineUsers = new Map();

app.set('socketio', io);
app.set('onlineUsers', onlineUsers);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'PetVerse Server is ALIVE 🐾',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌',
    mongo: mongoose.connection.readyState === 1 ? '✅' : '❌'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stories', storyRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('getMessage', {
        senderId,
        text,
        createdAt: Date.now(),
      });
    }
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userTyping', { senderId });
    }
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userStopTyping', { senderId });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    console.log('User disconnected:', socket.id);
  });
});

// Global Error Logger - MUST BE LAST
app.use((err, req, res, next) => {
  console.error('💥 Global Error Handler:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: err // Temporarily expose for debugging
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
