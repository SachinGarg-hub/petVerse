const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');

router.use(auth);

router.get('/', getNotifications);
router.put('/:id/read', checkDemo, markAsRead);
router.put('/read-all', checkDemo, markAllAsRead);

module.exports = router;
