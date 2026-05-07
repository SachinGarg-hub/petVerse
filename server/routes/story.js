const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
const {
  createStory,
  getFollowedStories,
  viewStory,
} = require('../controllers/storyController');

router.post('/', auth, checkDemo, createStory);
router.get('/following', auth, getFollowedStories);
router.put('/:id/view', auth, checkDemo, viewStory);

module.exports = router;
