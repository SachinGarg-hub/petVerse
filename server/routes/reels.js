const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
const {
  createReel,
  getAllReels,
  likeReel,
  commentOnReel,
  addView,
} = require('../controllers/reelController');

router.post('/', auth, checkDemo, createReel);
router.get('/', getAllReels);
router.put('/:id/like', auth, checkDemo, likeReel);
router.post('/:id/comment', auth, checkDemo, commentOnReel);
router.put('/:id/view', addView);

module.exports = router;
