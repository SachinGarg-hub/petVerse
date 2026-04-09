const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  deletePost,
  savePost,
  getUserPosts,
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentOnPost);
router.delete('/:id', auth, deletePost);
router.put('/:id/save', auth, savePost);
router.get('/user/:userId', getUserPosts);

module.exports = router;
