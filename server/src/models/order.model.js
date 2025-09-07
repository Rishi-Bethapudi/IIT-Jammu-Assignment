const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        vegetable: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vegetable',
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    receiptUrl: { type: String }, // Cloudinary URL of the PDF receipt if uploaded
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
