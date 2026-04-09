const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
} = require('../controllers/messageController');

router.post('/conversations', auth, createConversation);
router.get('/conversations', auth, getUserConversations);
router.post('/', auth, sendMessage);
router.get('/:conversationId', auth, getMessages);

module.exports = router;
