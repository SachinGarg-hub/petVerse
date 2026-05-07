const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
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
router.put('/profile', auth, checkDemo, updateProfile);
router.put('/:id/follow', auth, checkDemo, followUser);

module.exports = router;
