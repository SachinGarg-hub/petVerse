const Reel = require('../models/Reel');
const createNotification = require('../utils/notification');

exports.createReel = async (req, res) => {
  try {
    const { videoUrl, caption } = req.body;
    const reel = await Reel.create({
      user: req.userId,
      videoUrl,
      caption,
    });
    const populated = await reel.populate('user', 'username profilePic');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const reels = await Reel.find()
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reel.countDocuments();

    res.json({
      reels,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const index = reel.likes.indexOf(req.userId);
    if (index === -1) {
      reel.likes.push(req.userId);
    } else {
      reel.likes.splice(index, 1);
    }
    await reel.save();

    // Trigger notification
    if (index === -1) {
      const io = req.app.get('socketio');
      const onlineUsers = req.app.get('onlineUsers');
      await createNotification(io, onlineUsers, {
        recipient: reel.user,
        sender: req.userId,
        type: 'reel_like',
        reel: reel._id
      });
    }

    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.commentOnReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    reel.comments.push({ user: req.userId, text: req.body.text });
    await reel.save();

    // Trigger notification
    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    await createNotification(io, onlineUsers, {
      recipient: reel.user,
      sender: req.userId,
      type: 'comment',
      reel: reel._id,
      content: req.body.text
    });

    const updated = await Reel.findById(req.params.id)
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addView = async (req, res) => {
  try {
    await Reel.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: 'View counted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
