const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Enable CORS for all origins
const allowedOrigins = [
  'http://localhost:5173', // your local dev frontend
  'http://localhost:5174', // if using Vite's preview port
  'https://iit-jammu-assignment.vercel.app', // your deployed frontend
];

app.use(
  cors({
    origin: [
      'http://localhost:5173', // your local dev frontend
      'http://localhost:5174', // if using Vite's preview port
      'https://iit-jammu-assignment.vercel.app', // your deployed frontend
      'https://ht9t3tq8-5000.inc1.devtunnels.ms',
    ],
    credentials: true,
  })
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/vegetables', require('./routes/vegetable.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
