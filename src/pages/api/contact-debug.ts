import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🔍 Debug contact API called');
    
    // Step 1: Check basic functionality
    console.log('✅ Step 1: Basic function works');
    
    // Step 2: Check form data parsing
    const formData = await request.formData();
    console.log('✅ Step 2: Form data parsed');
    
    // Step 3: Check environment variables
    const envCheck = {
      smtpHost: !!process.env.SMTP_HOST,
      smtpUser: !!process.env.SMTP_USER,
      smtpPass: !!process.env.SMTP_PASS,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    };
    console.log('✅ Step 3: Environment variables checked:', envCheck);
    
    // Step 4: Try nodemailer import (this might be the issue)
    let nodemailerStatus = 'not_attempted';
    try {
      const nodemailer = await import('nodemailer');
      nodemailerStatus = 'success';
      console.log('✅ Step 4: Nodemailer imported successfully');
      
      // Step 5: Try creating transporter
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        console.log('✅ Step 5: Transporter created successfully');
        
        // Don't actually send email, just verify creation
        nodemailerStatus = 'transporter_created';
      }
    } catch (nodemailerError) {
      console.error('❌ Step 4/5: Nodemailer error:', nodemailerError);
      nodemailerStatus = `error: ${nodemailerError?.message}`;
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Debug API completed all steps',
      debug: {
        envCheck,
        nodemailerStatus,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Debug API failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack?.split('\n').slice(0, 5)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
