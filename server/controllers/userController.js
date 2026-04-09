const User = require('../models/User');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePic')
      .populate('following', 'username profilePic');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, bio, profilePic },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    if (req.userId === req.params.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow)
      return res.status(404).json({ message: 'User not found' });

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following.pull(req.params.id);
      userToFollow.followers.pull(req.userId);
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.userId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      following: currentUser.following,
      message: isFollowing ? 'Unfollowed' : 'Followed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: 'i' },
    })
      .select('username profilePic bio')
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const users = await User.find({
      _id: { $nin: [...currentUser.following, req.userId] },
    })
      .select('username profilePic bio')
      .limit(5);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
