// Simple test endpoint for Vercel Functions
export default async function handler(req, res) {
  console.log('🧪 Test API endpoint called');
  
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Vercel Function is working!',
      timestamp: new Date().toISOString(),
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
      },
      headers: {
        userAgent: req.headers['user-agent'],
        host: req.headers.host,
        forwarded: req.headers['x-forwarded-for']
      }
    });
  } catch (error) {
    console.error('❌ Test API error:', error);
    
    return res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack?.split('\n').slice(0, 5)
    });
  }
}
