const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getCart,
  addToCart,
  removeFromCart,
} = require('../controllers/cart.controller');

// Protected routes
router.get('/', getCart);
router.post('/', addToCart);

router.delete('/cart/:id', removeFromCart);

module.exports = router;
