const Cart = require('../models/cart.model');
const Vegetable = require('../models/vegetable.model');
const asyncHandler = require('express-async-handler');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.vegetable'
  );
  if (!cart) return res.json({ items: [] });
  res.json(cart);
});

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { vegetableId, quantity } = req.body;

  const vegetable = await Vegetable.findById(vegetableId);
  if (!vegetable) throw new Error('Vegetable not found');

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ vegetable: vegetableId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.vegetable.toString() === vegetableId
    );
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Add new item
      cart.items.push({ vegetable: vegetableId, quantity });
    }
  }

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:vegetableId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { vegetableId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(
    (item) => item.vegetable.toString() !== vegetableId
  );
  const updatedCart = await cart.save();
  res.json(updatedCart);
});

module.exports = { getCart, addToCart, removeFromCart };
