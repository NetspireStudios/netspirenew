import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🚀 Simple contact API called');
    
    // Just parse the form data without any external dependencies
    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };
    
    console.log('📧 Form data received:', data);
    
    // Return success without trying to send email
    return new Response(JSON.stringify({
      success: true,
      message: 'Simple API working! Form data received successfully.',
      receivedData: data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Simple API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || 'Unknown error in simple API'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    message: 'Simple contact API is running',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
