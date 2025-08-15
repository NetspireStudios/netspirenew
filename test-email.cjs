const nodemailer = require('nodemailer').default || require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🔧 Testing email configuration...');
  console.log('Gmail Account:', process.env.SMTP_USER);
  console.log('Contact Email:', process.env.CONTACT_EMAIL);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Missing email credentials in .env file');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    console.log('📧 Sending test email...');
    
    const info = await transporter.sendMail({
      from: `"NETSPIRE Studio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'NETSPIRE Contact Form - Test Email ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a90e2;">✅ Email Setup Successful!</h1>
          <p>Congratulations! Your NETSPIRE contact form is now ready to send emails.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>Gmail Account:</strong> ${process.env.SMTP_USER}</p>
            <p><strong>Contact Email:</strong> ${process.env.CONTACT_EMAIL}</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Your contact form will now automatically send professional emails like this one whenever someone submits an inquiry.</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <h4 style="color: #4a90e2; margin-top: 0;">Next Steps:</h4>
            <ul style="margin: 10px 0;">
              <li>Visit your contact form at: <strong>http://localhost:4321</strong></li>
              <li>Test a form submission</li>
              <li>Check this Gmail inbox for contact form emails</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This test email was sent automatically when setting up your NETSPIRE contact form.
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('🎯 Check your Gmail inbox:', process.env.CONTACT_EMAIL);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your Gmail App Password is correct');
    console.log('2. Ensure 2-Factor Authentication is enabled');
    console.log('3. Check your .env file for typos');
  }
}

testEmail();
