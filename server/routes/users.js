const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getUser,
  updateProfile,
  followUser,
  searchUsers,
  getSuggestedUsers,
} = require('../controllers/userController');

router.get('/search', auth, searchUsers);
router.get('/suggested', auth, getSuggestedUsers);
router.get('/:id', getUser);
router.put('/profile', auth, updateProfile);
router.put('/:id/follow', auth, followUser);

module.exports = router;
