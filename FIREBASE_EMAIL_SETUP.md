# Firebase Email Setup Guide

This guide will help you set up email verification with Firebase for the GreenRaise application.

## 1. Firebase Console Setup

### Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (green-raise-agro)
3. Go to Authentication > Sign-in method
4. Enable Email/Password authentication
5. Enable "Email link (passwordless sign-in)" if you want to use email links

### Step 2: Configure Email Templates
1. In Firebase Console, go to Authentication > Templates
2. You'll see different email templates:
   - Email verification
   - Password reset
   - Email sign-in

### Step 3: Customize Email Verification Template
1. Click on "Email verification" template
2. Customize the template with your brand colors (#08A486 for GreenRaise)
3. Update the subject line to: "Verify Your Email - GreenRaise"
4. Customize the email content to match your brand

## 2. SMTP Configuration

### Option 1: Use Gmail SMTP (Recommended for Development)
1. Create a Gmail account or use existing one
2. Enable 2-factor authentication
3. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"

### Option 2: Use Firebase SMTP (Production)
1. In Firebase Console, go to Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Use Firebase Admin SDK for email sending

## 3. Environment Variables

Add these to your `.env` file in the backend directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Firebase Configuration (if using Firebase SMTP)
FIREBASE_PROJECT_ID=green-raise-agro
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## 4. Email Template Examples

### Verification Email Template
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #08A486; margin: 0;">GreenRaise</h1>
    <p style="color: #666; margin: 10px 0;">Your trusted source for sustainable products</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
    <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
      Hello {{name}},<br><br>
      Thank you for registering with GreenRaise! To complete your registration, please use the verification code below:
    </p>
    
    <div style="background: #08A486; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">{{otp}}</h1>
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
```

## 5. Testing the Setup

1. Start your backend server:
   ```bash
   cd backend
   npm run server
   ```

2. Test the email verification endpoint:
   ```bash
   curl -X POST http://localhost:2999/api/ecom/email-verification/send-verification \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User"}'
   ```

3. Check your email for the verification code

## 6. Production Considerations

### Security
- Use environment variables for sensitive data
- Implement rate limiting for OTP requests
- Use Redis or database for OTP storage instead of in-memory Map
- Add CAPTCHA for registration forms

### Reliability
- Implement email delivery tracking
- Add fallback email providers
- Monitor email delivery rates
- Set up email bounce handling

### Performance
- Use email queuing for high-volume sending
- Implement email templates caching
- Add email sending retry logic

## 7. Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SMTP credentials
   - Verify firewall settings
   - Check email provider limits

2. **OTP not working**
   - Check OTP storage (Map vs Database)
   - Verify OTP expiration logic
   - Check timezone settings

3. **Firebase integration issues**
   - Verify Firebase project configuration
   - Check API keys and permissions
   - Ensure proper CORS settings

### Debug Commands

```bash
# Test email sending
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
});
transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test',
  text: 'Test email'
}).then(console.log).catch(console.error);
"
```

## 8. Next Steps

1. Set up email templates in Firebase Console
2. Configure environment variables
3. Test the email verification flow
4. Implement production email provider
5. Add email analytics and monitoring
6. Set up email bounce handling
7. Implement email preferences management 