const Vegetable = require('../models/vegetable.model');
const cloudinary = require('../config/cloudinary'); // your Cloudinary config
const asyncHandler = require('express-async-handler');

// @desc    Get all vegetables
// @route   GET /api/vegetables
// @access  Public
const getVegetables = asyncHandler(async (req, res) => {
  const vegetables = await Vegetable.find();
  res.json(vegetables);
});

// @desc    Get a single vegetable
// @route   GET /api/vegetables/:id
// @access  Public
const getVegetableById = asyncHandler(async (req, res) => {
  const vegetable = await Vegetable.findById(req.params.id);
  if (!vegetable) throw new Error('Vegetable not found');
  res.json(vegetable);
});

// @desc    Create a new vegetable
// @route   POST /api/vegetables
// @access  Private/Admin
const createVegetable = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  let images = [];
  if (req.files) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'vegetables',
      });
      images.push({ url: result.secure_url, public_id: result.public_id });
    }
  }

  const vegetable = await Vegetable.create({
    name,
    description,
    price,
    stock,
    category,
    images,
  });
  res.status(201).json(vegetable);
});

// @desc    Update a vegetable
// @route   PUT /api/vegetables/:id
// @access  Private/Admin
const updateVegetable = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const vegetable = await Vegetable.findById(req.params.id);
  if (!vegetable) throw new Error('Vegetable not found');

  // Optional: delete old images from Cloudinary if new images are uploaded
  if (req.files && req.files.length > 0) {
    // delete old images
    for (const img of vegetable.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    // upload new images
    let images = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'vegetables',
      });
      images.push({ url: result.secure_url, public_id: result.public_id });
    }
    vegetable.images = images;
  }

  vegetable.name = name || vegetable.name;
  vegetable.description = description || vegetable.description;
  vegetable.price = price || vegetable.price;
  vegetable.stock = stock || vegetable.stock;
  vegetable.category = category || vegetable.category;

  const updatedVegetable = await vegetable.save();
  res.json(updatedVegetable);
});

// @desc    Delete a vegetable
// @route   DELETE /api/vegetables/:id
// @access  Private/Admin
const deleteVegetable = asyncHandler(async (req, res) => {
  const vegetable = await Vegetable.findById(req.params.id);
  if (!vegetable) throw new Error('Vegetable not found');

  // Delete images from Cloudinary
  for (const img of vegetable.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await vegetable.remove();
  res.json({ message: 'Vegetable removed' });
});

module.exports = {
  getVegetables,
  getVegetableById,
  createVegetable,
  updateVegetable,
  deleteVegetable,
};
