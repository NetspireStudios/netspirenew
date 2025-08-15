# Contact Form Email Setup Guide

Your contact form is now fully functional with comprehensive spam protection and validation. Here's how to set up actual email delivery for production use.

## Current Status

✅ **Working Features:**
- Form validation (client & server-side)
- Spam protection (honeypot, content filtering, rate limiting)
- Professional UI with loading states
- Character counting and real-time validation
- Error handling and user feedback

📝 **Form submissions are currently logged to console** - you need to configure email delivery for production.

## Email Service Integration Options

### 1. Nodemailer with SMTP (Recommended)

```bash
npm install nodemailer @types/nodemailer
```

Update `/src/pages/api/contact.ts`:

```typescript
import nodemailer from 'nodemailer';

// Add environment variables to .env:
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_USER=your-email@gmail.com
// SMTP_PASS=your-app-password
// CONTACT_EMAIL=contact@yourcompany.com

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Add this after sanitizedData validation:
await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: process.env.CONTACT_EMAIL,
  subject: `New Contact Form Submission from ${sanitizedData.name}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${sanitizedData.name}</p>
    <p><strong>Email:</strong> ${sanitizedData.email}</p>
    <p><strong>Company:</strong> ${sanitizedData.company}</p>
    <p><strong>Budget:</strong> ${sanitizedData.budget}</p>
    <p><strong>Services:</strong> ${sanitizedData.services.join(', ')}</p>
    <p><strong>Message:</strong></p>
    <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
    <p><strong>Submitted:</strong> ${sanitizedData.timestamp}</p>
  `
});
```

### 2. SendGrid (Cloud Service)

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: process.env.CONTACT_EMAIL,
  from: process.env.SENDGRID_FROM_EMAIL, // Must be verified
  subject: `New Contact Form Submission from ${sanitizedData.name}`,
  html: `...` // Same HTML as above
};

await sgMail.send(msg);
```

### 3. AWS SES

```bash
npm install @aws-sdk/client-ses
```

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const command = new SendEmailCommand({
  Source: process.env.SES_FROM_EMAIL,
  Destination: { ToAddresses: [process.env.CONTACT_EMAIL!] },
  Message: {
    Subject: { Data: `New Contact Form Submission from ${sanitizedData.name}` },
    Body: { Html: { Data: `...` } }
  }
});

await sesClient.send(command);
```

## Environment Variables Setup

Create `.env` file in your project root:

```env
# SMTP Configuration (for Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@yourcompany.com

# Alternative: SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourcompany.com

# Alternative: AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SES_FROM_EMAIL=noreply@yourcompany.com
```

## Gmail Setup (Most Common)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Create app password for "Mail"
   - Use this password in SMTP_PASS

## Production Security Enhancements

### 1. Database Storage (Recommended)
Consider storing form submissions in a database for backup:

```typescript
// Add to your API endpoint
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.contactSubmission.create({
  data: {
    name: sanitizedData.name,
    email: sanitizedData.email,
    company: sanitizedData.company,
    budget: sanitizedData.budget,
    services: sanitizedData.services,
    message: sanitizedData.message,
    ip: sanitizedData.ip,
    submittedAt: new Date()
  }
});
```

### 2. Advanced Rate Limiting
For production, use Redis for distributed rate limiting:

```bash
npm install redis
```

### 3. reCAPTCHA Integration
Add Google reCAPTCHA for additional spam protection:

```bash
npm install react-google-recaptcha
```

## Testing Your Setup

1. **Test Form Submission:**
   - Fill out the contact form
   - Check browser console for logs
   - Verify email delivery

2. **Test Spam Protection:**
   - Try submitting with honeypot field filled
   - Test rapid submissions (rate limiting)
   - Use spam keywords in message

3. **Test Validation:**
   - Submit empty fields
   - Use invalid email formats
   - Exceed character limits

## Deployment Notes

- **Astro Build**: The API routes work in both dev and production
- **Environment Variables**: Ensure all env vars are set in your hosting platform
- **CORS**: The API includes CORS headers if needed
- **Monitoring**: Consider adding email delivery monitoring

## Support

Your contact form is production-ready with:
- ✅ Professional validation
- ✅ Spam protection
- ✅ Rate limiting
- ✅ User-friendly error handling
- ✅ Mobile-optimized design

Just add your preferred email service integration and you're ready to go!
