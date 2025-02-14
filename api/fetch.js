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

  // Handle OPTIONS request (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  // Handle GET request (API status)
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'Blog Summary API is running!' }),
      { headers }
    );
  }

  // Handle POST request (actual summary generation)
  if (request.method === 'POST') {
    try {
      const { url } = await request.json();

      if (!url) {
        return new Response(
          JSON.stringify({ error: 'URL is required' }),
          { status: 400, headers }
        );
      }

      // Fetch the webpage content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status}`);
      }

      const html = await response.text();

      // Get summary from OpenAI
      const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Summarize this webpage content in 3-4 sentences: ${html.substring(0, 1500)}`
          }]
        })
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryData = await summaryResponse.json();
      const summary = summaryData.choices[0].message.content;

      // Extract basic metadata
      const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || '';
      const images = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi))
        .map(match => match[1])
        .filter(src => src && !src.startsWith('data:'));

      return new Response(
        JSON.stringify({
          title,
          summary,
          images,
          url
        }),
        { headers }
      );

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process webpage',
          details: error.message
        }),
        { status: 500, headers }
      );
    }
  }

  // Handle invalid methods
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers }
  );
}
