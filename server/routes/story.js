const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createStory,
  getFollowedStories,
  viewStory,
} = require('../controllers/storyController');

router.post('/', auth, createStory);
router.get('/following', auth, getFollowedStories);
router.put('/:id/view', auth, viewStory);

module.exports = router;
