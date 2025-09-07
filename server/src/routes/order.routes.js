const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { placeOrder } = require('../controllers/order.controller');

// Protected routes
router.post('/', protect, placeOrder);

module.exports = router;
