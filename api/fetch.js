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

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers }
    );
  }

  try {
    const data = await req.json();
    const { url } = data;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { status: 400, headers }
      );
    }

    // For testing, return a simple response
    return new Response(
      JSON.stringify({
        content: "This is a test summary of the content.",
        media: {
          images: [],
          videos: []
        },
        outline: []
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
