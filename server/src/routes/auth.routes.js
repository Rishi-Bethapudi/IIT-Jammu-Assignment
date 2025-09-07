const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private
router.post('/logout', protect, logoutUser);

module.exports = router;
