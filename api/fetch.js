// api/fetch.js
export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle root path
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'Blog Summary API is running!' }),
      { headers }
    );
  }

  return new Response(
    JSON.stringify({ message: 'Please use POST method' }),
    { headers }
  );
}
