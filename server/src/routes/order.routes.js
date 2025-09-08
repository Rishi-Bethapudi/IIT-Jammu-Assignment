const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { placeOrder } = require('../controllers/order.controller');

// Protected routes
router.post('/orders', placeOrder);

module.exports = router;
