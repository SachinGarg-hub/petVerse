const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
} = require('../controllers/messageController');

router.post('/conversations', auth, checkDemo, createConversation);
router.get('/conversations', auth, getUserConversations);
router.post('/', auth, checkDemo, sendMessage);
router.get('/:conversationId', auth, getMessages);

module.exports = router;
