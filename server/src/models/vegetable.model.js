const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // Cloudinary public ID for deletion if needed
      },
    ],
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vegetable', vegetableSchema);
