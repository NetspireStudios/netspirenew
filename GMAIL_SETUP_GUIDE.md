# Gmail Setup Guide for Contact Form

This guide will walk you through setting up Gmail to send emails from your contact form.

## 🚀 Quick Setup Overview

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password** for your application
3. **Install email dependencies** in your project
4. **Configure environment variables**
5. **Update the contact API** with Gmail settings
6. **Test the form**

---

## 📧 Step 1: Gmail Account Setup

### Enable 2-Factor Authentication

1. Go to your **Google Account** → [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA (you'll need your phone)

### Generate App Password

1. Still in **Security** settings, scroll down to **2-Step Verification**
2. At the bottom, click **App passwords**
3. Select app: **Mail**
4. Select device: **Windows Computer** (or your device)
5. Click **GENERATE**
6. **COPY THE 16-CHARACTER PASSWORD** - you'll need this!

---

## 🛠️ Step 2: Install Dependencies

Run this command in your project directory:

```bash
cd netspirenew-master
npm install nodemailer @types/nodemailer
```

---

## 📝 Step 3: Create Environment File

Create a `.env` file in your project root (`netspirenew-master/.env`):

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_EMAIL=your-email@gmail.com

# Optional: Different reply-to email
REPLY_TO_EMAIL=contact@yourcompany.com
```

### Replace these values:
- `your-gmail@gmail.com` → Your actual Gmail address
- `your-16-character-app-password` → The app password from Step 1
- `your-email@gmail.com` → Where you want to receive contact form emails

---

## 🔧 Step 4: Update Contact API

I'll update your contact API to use Gmail. Here's what needs to be changed in `/src/pages/api/contact.ts`:

```typescript
import nodemailer from 'nodemailer';

// Add this transporter configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Add this email sending function (replace the console.log section)
await transporter.sendMail({
  from: `"NETSPIRE Contact Form" <${process.env.SMTP_USER}>`,
  to: process.env.CONTACT_EMAIL,
  replyTo: sanitizedData.email,
  subject: `New Contact Form Submission from ${sanitizedData.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4a90e2;">Contact Information</h3>
        <p><strong>Name:</strong> ${sanitizedData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
        <p><strong>Company:</strong> ${sanitizedData.company || 'Not provided'}</p>
        <p><strong>Budget Range:</strong> ${sanitizedData.budget || 'Not specified'}</p>
      </div>

      ${sanitizedData.services.length > 0 ? `
      <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4a90e2;">Services Interested In</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${sanitizedData.services.map(service => `<li>${service}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Project Details</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${sanitizedData.message}</p>
      </div>

      <div style="background: #f1f3f4; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
        <p><strong>Submitted:</strong> ${sanitizedData.timestamp}</p>
        <p><strong>IP Address:</strong> ${sanitizedData.ip}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>This email was sent from the NETSPIRE contact form.</p>
        <p>Reply directly to this email to respond to ${sanitizedData.name}.</p>
      </div>
    </div>
  `
});
```

---

## 🧪 Step 5: Test Configuration

### Test Email Function

Create a test file `test-email.js` in your project root:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: 'Test Email from NETSPIRE Contact Form',
      html: '<h1>Test Successful!</h1><p>Your Gmail setup is working correctly.</p>'
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

testEmail();
```

Run the test:
```bash
node test-email.js
```

---

## 🔒 Security Best Practices

### Environment Variables Security
- ✅ **Never commit `.env` to version control**
- ✅ **Add `.env` to your `.gitignore` file**
- ✅ **Use different emails for development and production**

### Gmail Security
- ✅ **Use App Passwords, never your regular password**
- ✅ **Enable 2FA on your Gmail account**
- ✅ **Monitor your account for unusual activity**

---

## 🚨 Troubleshooting

### Common Issues

**1. "Invalid login" error:**
- Make sure you're using the **App Password**, not your regular Gmail password
- Verify 2FA is enabled on your account

**2. "Less secure app access" error:**
- This shouldn't happen with App Passwords, but if it does:
- Go to Google Account → Security → Less secure app access → Turn ON

**3. Emails going to spam:**
- Add your domain to Gmail's trusted senders
- Use proper "From" name formatting
- Include unsubscribe links in production

**4. Rate limiting:**
- Gmail has sending limits (500 emails/day for free accounts)
- For high volume, consider upgrading to Google Workspace

---

## 📋 Quick Checklist

Before going live, ensure:

- [ ] 2FA enabled on Gmail
- [ ] App Password generated and saved
- [ ] `.env` file created with correct values
- [ ] `nodemailer` installed
- [ ] Contact API updated with email code
- [ ] Test email sent successfully
- [ ] `.env` added to `.gitignore`

---

## 🎯 Production Deployment

When deploying to production:

1. **Add environment variables** to your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Railway: Variables tab

2. **Use production Gmail account** (consider Google Workspace for business)

3. **Monitor email delivery** in Gmail Sent folder

---

## 📞 Need Help?

If you encounter issues:
1. Check the test email function output
2. Verify your App Password is correct
3. Ensure 2FA is properly enabled
4. Check Gmail's "Less secure apps" settings

Your contact form will be ready to send professional emails once this setup is complete! 🚀
