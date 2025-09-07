const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Vegetable name
    description: { type: String }, // Details about the vegetable
    price: { type: Number, required: true }, // Base selling price
    discount: { type: Number, default: 0 }, // % discount
    stock: { type: Number, default: 0 }, // Available quantity
    unit: { type: String, default: 'kg' }, // Unit of measure (kg, g, piece, bundle, etc.)
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // Cloudinary public ID
      },
    ],
    category: { type: String }, // e.g., Leafy, Root, Organic
    isAvailable: { type: Boolean, default: true }, // Toggle availability
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field: Final Price after discount
vegetableSchema.virtual('finalPrice').get(function () {
  if (!this.price) return 0;
  return this.price - (this.price * this.discount) / 100;
});

module.exports = mongoose.model('Vegetable', vegetableSchema);
