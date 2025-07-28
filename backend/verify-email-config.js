require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Verifying email configuration...');

// Check environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email configuration missing!');
  console.error('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
  process.exit(1);
}

console.log('✅ Email credentials found');
console.log(`📧 Email User: ${process.env.EMAIL_USER}`);

// Test email configuration
const testEmailConfig = async () => {
  try {
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

    // Verify configuration
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    console.log('🚀 Email verification system ready for production!');
    
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if your Gmail account has 2FA enabled');
    console.log('2. Verify your App Password is correct');
    console.log('3. Make sure your Gmail account allows less secure apps');
    process.exit(1);
  }
};

testEmailConfig(); 