const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Initialize socket.io for this router
module.exports = function(io) {
  // Store OTPs temporarily (in production, use Redis or database)
  const otpStore = new Map();
  
  // Rate limiting for email sending
  const rateLimitStore = new Map();
  
  // Rate limiting function
  const checkRateLimit = (email) => {
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(email);
    
    if (!userRateLimit) {
      rateLimitStore.set(email, { count: 1, firstRequest: now });
      return true;
    }
    
    // Reset if more than 1 hour has passed
    if (now - userRateLimit.firstRequest > 60 * 60 * 1000) {
      rateLimitStore.set(email, { count: 1, firstRequest: now });
      return true;
    }
    
    // Allow max 5 requests per hour
    if (userRateLimit.count >= 5) {
      return false;
    }
    
    userRateLimit.count++;
    return true;
  };

  // Configure nodemailer for Gmail SMTP (Production)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
  });

  // Generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification email
  router.post('/send-verification', async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }

      // Check rate limiting
      if (!checkRateLimit(email)) {
        return res.status(429).json({ 
          message: 'Too many verification requests. Please wait 1 hour before trying again.' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP
      otpStore.set(email, {
        otp,
        expiry: otpExpiry,
        name: name || email.split('@')[0]
      });

      console.log(`Sending verification email to: ${email}`);

             // Email template
       const mailOptions = {
         from: `"GreenRaise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - GreenRaise',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #08A486; margin: 0;">GreenRaise</h1>
              <p style="color: #666; margin: 10px 0;">Your trusted source for sustainable products</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Hello ${name || 'there'},<br><br>
                Thank you for registering with GreenRaise! To complete your registration, please use the verification code below:
              </p>
              
              <div style="background: #08A486; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Verification Code</p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 GreenRaise. All rights reserved.<br>
                This is an automated email, please do not reply.
              </p>
            </div>
          </div>
        `
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Verification email sent successfully to: ${email}`);
      console.log(`Message ID: ${result.messageId}`);

      res.status(200).json({ 
        message: 'Verification email sent successfully',
        email: email
      });

    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      console.error('Error details:', {
        email: req.body.email,
        errorCode: error.code,
        errorMessage: error.message
      });
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to send verification email. Please try again.';
      if (error.code === 'EAUTH') {
        userMessage = 'Email authentication failed. Please contact support.';
      } else if (error.code === 'ECONNECTION') {
        userMessage = 'Email service temporarily unavailable. Please try again later.';
      }
      
      res.status(500).json({ message: userMessage, error: error.message });
    }
  });

  // Verify OTP
  router.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
      }

      // Get stored OTP data
      const storedData = otpStore.get(email);

      if (!storedData) {
        return res.status(400).json({ message: 'No verification request found for this email' });
      }

      // Check if OTP is expired
      if (Date.now() > storedData.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      }

      // OTP is valid - remove from store
      otpStore.delete(email);

      res.status(200).json({ 
        message: 'Email verified successfully',
        email: email,
        verified: true
      });

    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
  });

  // Resend OTP
  router.post('/resend-otp', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Check rate limiting
      if (!checkRateLimit(email)) {
        return res.status(429).json({ 
          message: 'Too many verification requests. Please wait 1 hour before trying again.' 
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Update stored OTP
      const existingData = otpStore.get(email);
      otpStore.set(email, {
        otp,
        expiry: otpExpiry,
        name: existingData?.name || email.split('@')[0]
      });

             // Email template for resend
       const mailOptions = {
         from: `"GreenRaise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'New Verification Code - GreenRaise',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #08A486; margin: 0;">GreenRaise</h1>
              <p style="color: #666; margin: 10px 0;">Your trusted source for sustainable products</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">New Verification Code</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Hello ${existingData?.name || 'there'},<br><br>
                You requested a new verification code. Here's your new verification code:
              </p>
              
              <div style="background: #08A486; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">New Verification Code</p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 GreenRaise. All rights reserved.<br>
                This is an automated email, please do not reply.
              </p>
            </div>
          </div>
        `
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Resend verification email sent successfully to: ${email}`);
      console.log(`Message ID: ${result.messageId}`);

      res.status(200).json({ 
        message: 'New verification code sent successfully',
        email: email
      });

    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      console.error('Error details:', {
        email: req.body.email,
        errorCode: error.code,
        errorMessage: error.message
      });
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to resend verification code. Please try again.';
      if (error.code === 'EAUTH') {
        userMessage = 'Email authentication failed. Please contact support.';
      } else if (error.code === 'ECONNECTION') {
        userMessage = 'Email service temporarily unavailable. Please try again later.';
      }
      
      res.status(500).json({ message: userMessage, error: error.message });
    }
  });

  return router;
}; 