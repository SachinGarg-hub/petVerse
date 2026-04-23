const { Message, Conversation } = require('../models/Message');
const createNotification = require('../utils/notification');

exports.createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const existing = await Conversation.findOne({
      members: { $all: [req.userId, receiverId] },
    });

    if (existing) {
      return res.json(existing);
    }

    const conversation = await Conversation.create({
      members: [req.userId, receiverId],
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.userId] },
    })
      .populate('members', 'username profilePic')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.userId,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
    });

    const populated = await message.populate('sender', 'username profilePic');

    // Trigger notification
    const conversation = await Conversation.findById(conversationId);
    const recipientId = conversation.members.find(m => m.toString() !== req.userId);
    
    if (recipientId) {
      const io = req.app.get('socketio');
      const onlineUsers = req.app.get('onlineUsers');
      await createNotification(io, onlineUsers, {
        recipient: recipientId,
        sender: req.userId,
        type: 'message',
        content: text
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate('sender', 'username profilePic')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
