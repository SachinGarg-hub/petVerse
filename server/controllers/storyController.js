const Story = require('../models/Story');
const User = require('../models/User');

exports.createStory = async (req, res) => {
  try {
    const { mediaUrl, mediaType } = req.body;
    const story = await Story.create({
      user: req.userId,
      mediaUrl,
      mediaType: mediaType || 'image',
    });
    const populated = await story.populate('user', 'username profilePic');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowedStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    // Include self stories + followed users stories
    const userIds = [...currentUser.following, req.userId];

    const stories = await Story.find({
      user: { $in: userIds },
    })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (!story.views.includes(req.userId)) {
      story.views.push(req.userId);
      await story.save();
    }
    res.json({ message: 'Viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
