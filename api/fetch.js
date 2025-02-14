// api/fetch.js
export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle the root route with a friendly message
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        message: 'Blog Summary API is running! Use POST /api/fetch to analyze content.',
        status: 'active' 
      }), 
      { headers }
    );
  }

  if (req.method === 'POST') {
    try {
      const data = await req.json();
      const { url } = data;

      if (!url) {
        return new Response(
          JSON.stringify({ error: 'URL is required' }), 
          { status: 400, headers }
        );
      }

      // Return a test response
      return new Response(
        JSON.stringify({
          content: "Test summary of the content.",
          media: {
            images: [],
            videos: []
          }
        }), 
        { headers }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process request',
          details: error.message 
        }), 
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }), 
    { status: 405, headers }
  );
}
