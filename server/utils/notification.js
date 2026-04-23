const Notification = require('../models/Notification');

/**
 * Creates a notification and emits it via socket.io if the user is online
 * @param {Object} io - Socket.io instance
 * @param {Map} onlineUsers - Map of online users
 * @param {Object} data - Notification data (recipient, sender, type, post, reel, content)
 */
const createNotification = async (io, onlineUsers, data) => {
  try {
    // Don't notify if sender and recipient are the same
    if (data.sender.toString() === data.recipient.toString()) return;

    const notification = await Notification.create(data);
    const populated = await notification.populate('sender', 'username profilePic');

    const receiverSocket = onlineUsers.get(data.recipient.toString());
    if (receiverSocket) {
      io.to(receiverSocket).emit('newNotification', populated);
    }
    
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

module.exports = createNotification;
