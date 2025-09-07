const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    dateOfBirth,
    gender,
    address,
    city,
    pincode,
    agreesToMarketing,
    role,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'Admin' ? 'admin' : 'user';
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
    dateOfBirth,
    gender,
    address,
    city,
    pincode,
    agreesToMarketing: agreesToMarketing || false,
    role: userRole, // default role
  });

  if (user) {
    // Optional: generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Determine expiry
    const expiresIn = rememberMe ? '30d' : '2h';

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000, // in ms
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // include role if needed
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message || 'Server error',
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = { registerUser, loginUser, logoutUser };
