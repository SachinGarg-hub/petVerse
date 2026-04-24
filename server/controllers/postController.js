const User = require('../models/User');
const createNotification = require('../utils/notification');

exports.createPost = async (req, res) => {
  try {
    const { mediaUrl, mediaType, caption } = req.body;
    const post = await Post.create({
      user: req.userId,
      mediaUrl,
      mediaType: mediaType || 'image',
      caption,
    });
    const populated = await post.populate('user', 'username profilePic');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;
    const skip = (page - 1) * limit;

    let filter = {};
    if (type === 'following') {
      const currentUser = await User.findById(req.userId);
      if (currentUser) {
        filter = { user: { $in: currentUser.following } };
      }
    }

    const posts = await Post.find(filter)
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.userId);
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();

    // Trigger notification
    if (index === -1) { // Only notify on Like, not unlike
      const io = req.app.get('socketio');
      const onlineUsers = req.app.get('onlineUsers');
      await createNotification(io, onlineUsers, {
        recipient: post.user,
        sender: req.userId,
        type: 'like',
        post: post._id
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.userId, text: req.body.text });
    await post.save();

    // Trigger notification
    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    await createNotification(io, onlineUsers, {
      recipient: post.user,
      sender: req.userId,
      type: 'comment',
      post: post._id,
      content: req.body.text
    });

    const updated = await Post.findById(req.params.id)
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const postId = req.params.id;
    const index = user.savedPosts.indexOf(postId);
    if (index === -1) {
      user.savedPosts.push(postId);
    } else {
      user.savedPosts.splice(index, 1);
    }
    await user.save();
    res.json({ savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLikers = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('likes', 'username profilePic bio');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
