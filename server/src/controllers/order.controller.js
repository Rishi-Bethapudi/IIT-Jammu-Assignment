const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const cloudinary = require('../config/cloudinary');
const nodemailer = require('../config/nodemailer');
const fs = require('fs');
const path = require('path');

// @desc    Place an order, generate PDF, upload to Cloudinary, send email
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.vegetable'
  );
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  const orderItems = cart.items.map((item) => ({
    vegetable: item.vegetable._id,
    name: item.vegetable.name,
    price: item.vegetable.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 1️⃣ Create the order in DB
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalPrice,
    status: 'Completed',
  });

  // 2️⃣ Generate PDF receipt
  const pdfPath = path.join(__dirname, `../receipts/order-${order._id}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(pdfPath));

  // --- Template ---
  doc
    .fontSize(26)
    .text('🛒 Vegetable Shop Receipt', { align: 'center' })
    .moveDown();

  doc.fontSize(16).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.text(`Customer: ${req.user.name}`);
  doc.text(`Email: ${req.user.email}`);
  doc.moveDown();

  doc.fontSize(18).text('Items:', { underline: true });
  doc.moveDown(0.5);

  orderItems.forEach((item) => {
    doc
      .fontSize(14)
      .text(
        `${item.name} - ${item.quantity} x ₹${item.price} = ₹${
          item.quantity * item.price
        }`
      );
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total Price: ₹${totalPrice}`, { bold: true });
  doc.moveDown(2);

  doc.fontSize(12).text('Thank you for shopping with us!', { align: 'center' });
  doc.end();

  // 3️⃣ Upload PDF to Cloudinary
  const result = await cloudinary.uploader.upload(pdfPath, {
    resource_type: 'auto', // allows uploading PDFs
    folder: 'receipts',
    public_id: `order-${order._id}`,
  });

  // Update order with receipt URL
  order.receiptUrl = result.secure_url;
  await order.save();

  // 4️⃣ Send email with receipt
  await nodemailer.sendMail({
    from: process.env.EMAIL_USER,
    to: req.user.email,
    subject: 'Your Order Receipt',
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order ID: ${order._id}</p>
      <p>Total: ₹${totalPrice}</p>
      <p>You can download your receipt here: <a href="${result.secure_url}" target="_blank">Download PDF</a></p>
      <br>
      <p>Vegetable Shop Team</p>
    `,
    attachments: [
      {
        filename: `order-${order._id}.pdf`,
        path: pdfPath,
      },
    ],
  });

  // 5️⃣ Clear the cart
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    message: 'Order placed successfully. Receipt sent to email.',
    order,
  });
});

module.exports = { placeOrder };
