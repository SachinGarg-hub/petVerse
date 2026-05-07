const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
const {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  deletePost,
  savePost,
  getUserPosts,
  getLikers,
} = require('../controllers/postController');

router.post('/', auth, checkDemo, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/:id/likers', getLikers);
router.put('/:id/like', auth, checkDemo, likePost);
router.post('/:id/comment', auth, checkDemo, commentOnPost);
router.delete('/:id', auth, checkDemo, deletePost);
router.put('/:id/save', auth, checkDemo, savePost);
router.get('/user/:userId', getUserPosts);

module.exports = router;
