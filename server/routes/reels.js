const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createReel,
  getAllReels,
  likeReel,
  commentOnReel,
  addView,
} = require('../controllers/reelController');

router.post('/', auth, createReel);
router.get('/', getAllReels);
router.put('/:id/like', auth, likeReel);
router.post('/:id/comment', auth, commentOnReel);
router.put('/:id/view', addView);

module.exports = router;
