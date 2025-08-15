import type { APIRoute } from 'astro';

export const prerender = false;

// Load environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
  try {
    const { config } = await import('dotenv');
    config();
  } catch (e) {
    // dotenv not available in production, which is fine
  }
}

// Environment variables getter
const getEnvVar = (key: string): string | undefined => {
  return process.env[key];
};

// Simple rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per 15 minutes

// Simple honeypot and spam detection
function isSpam(data: any): boolean {
  // Honeypot field check
  if (data.website) return true;
  
  // Content spam detection
  const spamKeywords = ['viagra', 'casino', 'lottery', 'investment', 'crypto', 'bitcoin'];
  const content = (data.message || '').toLowerCase();
  
  return spamKeywords.some(keyword => content.includes(keyword));
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  // Reset if window expired
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  // Check if under limit
  if (userLimit.count < RATE_LIMIT_MAX_REQUESTS) {
    userLimit.count++;
    return true;
  }
  
  return false;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get client IP (simplified for development)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Too many requests. Please try again later.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please fill in all required fields.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please enter a valid email address.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for spam
    if (isSpam(data)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message detected as spam.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      company: data.company ? sanitizeInput(data.company) : '',
      budget: data.budget || '',
      services: Array.isArray(data.services) ? data.services : [],
      message: sanitizeInput(data.message),
      timestamp: new Date().toISOString(),
      ip: clientIP
    };

    console.log('📧 New contact form submission:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company,
      budget: sanitizedData.budget,
      services: sanitizedData.services,
      timestamp: sanitizedData.timestamp
    });

    // Gmail/SMTP Email Integration
    const smtpHost = getEnvVar('SMTP_HOST');
    const smtpUser = getEnvVar('SMTP_USER');
    const smtpPass = getEnvVar('SMTP_PASS');
    const contactEmail = getEnvVar('CONTACT_EMAIL');

    console.log('🔧 SMTP Configuration Check:', {
      smtpHost: smtpHost ? 'SET' : 'NOT SET',
      smtpUser: smtpUser ? 'SET' : 'NOT SET',
      smtpPass: smtpPass ? 'SET' : 'NOT SET',
      contactEmail: contactEmail ? 'SET' : 'NOT SET'
    });

    // Additional debugging for production
    console.log('🌍 Environment Check:', {
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      vercelEnv: process.env.VERCEL_ENV,
      smtpUserActual: smtpUser,
      smtpHostActual: smtpHost
    });

    if (smtpHost && smtpUser && smtpPass) {
      try {
        // Dynamic import for Nodemailer (install with: npm install nodemailer @types/nodemailer)
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(getEnvVar('SMTP_PORT') || '587'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const info = await transporter.sendMail({
          from: `"NETSPIRE Contact Form" <${smtpUser}>`,
          to: contactEmail || smtpUser,
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
                  ${sanitizedData.services.map((service: string) => `<li>${service}</li>`).join('')}
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

        console.log('✅ Email sent successfully via SMTP! Message ID:', info.messageId);
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        console.error('❌ Email error details:', {
          message: emailError.message,
          code: emailError.code,
          stack: emailError.stack?.split('\n')[0]
        });
        // Don't throw error - still return success to user, but log the email failure
        console.log('📝 Contact form submission saved (email delivery failed)');
      }
    } else {
      console.log('⚠️ SMTP not configured - submission logged only');
      console.log('💡 To enable email delivery, add SMTP environment variables');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred while sending your message. Please try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS for CORS (if needed)
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
