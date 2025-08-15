import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 Minimal contact API called');
  
  try {
    // Get form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    
    console.log('📧 Contact form submission:', { name, email });
    
    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please fill in all required fields.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Just log the submission for now - no email sending
    console.log('📝 Form submitted successfully:', {
      name,
      email,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Minimal contact API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred. Please try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
