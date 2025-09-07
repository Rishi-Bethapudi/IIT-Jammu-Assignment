const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth.middleware');
const {
  getVegetables,
  getVegetableById,
  createVegetable,
  updateVegetable,
  deleteVegetable,
} = require('../controllers/vegetable.controller');

// Setup multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public
router.get('/', getVegetables);
router.get('/:id', getVegetableById);

// Admin protected
router.post('/', protect, upload.array('images', 5), createVegetable); // max 5 images
router.put('/:id', protect, upload.array('images', 5), updateVegetable);
router.delete('/:id', protect, deleteVegetable);

module.exports = router;
