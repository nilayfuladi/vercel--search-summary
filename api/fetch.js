import axios from 'axios';
import cheerio from 'cheerio';
import { extractMedia } from './extract';
import { generateOutline } from './outline';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch webpage content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract main content
    const content = $('article, main, .content, .post, .entry-content')
      .first()
      .text()
      .trim();

    // Extract media and outline
    const media = await extractMedia($, url);
    const outline = await generateOutline($);

    // Return processed data
    return res.status(200).json({
      content,
      media,
      outline
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process webpage',
      details: error.message 
    });
  }
}