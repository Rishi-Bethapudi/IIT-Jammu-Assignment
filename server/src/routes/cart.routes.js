const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getCart,
  addToCart,
  removeFromCart,
} = require('../controllers/cart.controller');

// Protected routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:vegetableId', protect, removeFromCart);

module.exports = router;
