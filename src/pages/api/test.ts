import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('🧪 Test API endpoint called');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
      },
      headers: {
        userAgent: request.headers.get('user-agent'),
        host: request.headers.get('host'),
        forwarded: request.headers.get('x-forwarded-for')
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('❌ Test API error:', error);
    
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
