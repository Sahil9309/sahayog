const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'sahayog.platform@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send invoice email
router.post('/send-invoice', async (req, res) => {
  try {
    const { invoiceNumber, amount, date, time, email, transactionId, paymentMethod, description } = req.body;

    const transporter = createTransporter();

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .total { font-size: 18px; font-weight: bold; color: #3b82f6; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Thank You for Your Contribution!</h1>
                <p>Sahayog Platform - Invoice Receipt</p>
            </div>
            
            <div class="content">
                <p>Dear Contributor,</p>
                <p>Thank you for your generous contribution to the Sahayog Platform. Your support helps creators and innovators bring their ideas to life.</p>
                
                <div class="invoice-details">
                    <h3>Invoice Details</h3>
                    <div class="detail-row">
                        <span>Invoice Number:</span>
                        <span><strong>${invoiceNumber}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span>Date & Time:</span>
                        <span>${date} at ${time}</span>
                    </div>
                    <div class="detail-row">
                        <span>Transaction ID:</span>
                        <span>${transactionId}</span>
                    </div>
                    <div class="detail-row">
                        <span>Payment Method:</span>
                        <span>${paymentMethod}</span>
                    </div>
                    <div class="detail-row">
                        <span>Description:</span>
                        <span>${description}</span>
                    </div>
                    <div class="detail-row total">
                        <span>Total Amount:</span>
                        <span>₹${amount}</span>
                    </div>
                </div>
                
                <p>Your contribution will help support innovative projects and make a real difference in the community.</p>
                
                <div class="footer">
                    <p>Best regards,<br>The Sahayog Team</p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'sahayog.platform@gmail.com',
      to: email,
      subject: `Invoice ${invoiceNumber} - Thank you for your contribution!`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      invoiceNumber 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send invoice email',
      error: error.message 
    });
  }
});

module.exports = router;