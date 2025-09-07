const transporter = require('../config/nodemailer');

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: userEmail,
  subject: 'Your Order Receipt',
  text: 'Thank you for your order!',
  attachments: [
    { filename: 'receipt.pdf', path: './receipts/order.pdf' }, // pdf path
  ],
});
