const Cart = require('../models/cart.model');
const Vegetable = require('../models/vegetable.model');
const asyncHandler = require('express-async-handler');

// helper to resolve userId
const getUserId = (req) => {
  return (
    req.user?._id || req.body.userId || req.query.userId || req.params.userId
  );
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (temp)
const getCart = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).json({ message: 'User ID missing' });
  }

  const cart = await Cart.findOne({ user: userId }).populate('items.vegetable');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
});

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Public (temp)
const addToCart = asyncHandler(async (req, res) => {
  const { vegetableId, quantity, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID missing' });
  }

  const vegetable = await Vegetable.findById(vegetableId);
  if (!vegetable) throw new Error('Vegetable not found');

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ vegetable: vegetableId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.vegetable.toString() === vegetableId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity; // update
    } else {
      cart.items.push({ vegetable: vegetableId, quantity }); // add new
    }
  }

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:vegetableId
// @access  Public (temp)
const removeFromCart = asyncHandler(async (req, res) => {
  const { vegetableId } = req.params;
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).json({ message: 'User ID missing' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(
    (item) => item.vegetable.toString() !== vegetableId
  );
  const updatedCart = await cart.save();
  res.json(updatedCart);
});

module.exports = { getCart, addToCart, removeFromCart };
