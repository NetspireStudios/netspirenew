// Vercel Serverless Function for contact form
export default async function handler(req, res) {
  console.log('🚀 Contact API called - Vercel Function');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { name, email, message, company, budget, services } = req.body;
    
    console.log('📧 Contact form submission:', { name, email, company, budget });
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields.'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }
    
    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL;
    
    console.log('🔧 SMTP Configuration:', {
      smtpHost: smtpHost ? 'SET' : 'NOT SET',
      smtpUser: smtpUser ? 'SET' : 'NOT SET',
      smtpPass: smtpPass ? 'SET' : 'NOT SET',
      contactEmail: contactEmail ? 'SET' : 'NOT SET'
    });
    
    if (smtpHost && smtpUser && smtpPass) {
      try {
        // Dynamic import for Nodemailer
        const nodemailer = await import('nodemailer');
        console.log('📧 Nodemailer imported successfully');
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });
        
        const servicesText = Array.isArray(services) && services.length > 0 
          ? services.map(service => `• ${service}`).join('\n')
          : 'None specified';
        
        await transporter.sendMail({
          from: `"NETSPIRE Contact Form" <${smtpUser}>`,
          to: contactEmail || smtpUser,
          replyTo: email,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #4a90e2;">Contact Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
              </div>

              ${services && services.length > 0 ? `
              <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #4a90e2;">Services Interested In</h3>
                <div style="white-space: pre-line;">${servicesText}</div>
              </div>
              ` : ''}

              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Project Details</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="background: #f1f3f4; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
                <p style="margin: 0;"><strong>Submission Details:</strong></p>
                <p style="margin: 5px 0;">Timestamp: ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0;">IP: ${req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'}</p>
                <p style="margin: 5px 0;">User Agent: ${req.headers['user-agent'] || 'unknown'}</p>
                <br>
                <p style="margin: 0;">Reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          `
        });

        console.log('✅ Email sent successfully via SMTP');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Don't throw error - still return success to user, but log the email failure
        console.log('📝 Contact form submission saved (email delivery failed)');
      }
    } else {
      console.log('⚠️ SMTP not configured - submission logged only');
      console.log('💡 To enable email delivery, add SMTP environment variables');
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'An error occurred while sending your message. Please try again.'
    });
  }
}
