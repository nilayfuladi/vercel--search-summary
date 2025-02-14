import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function processContent($) {
  // Extract main content
  const content = $('article, main, .content, .post, .entry-content')
    .first()
    .text()
    .trim();

  // Split content into chunks if too long
  const chunks = splitIntoChunks(content, 4000);
  
  // Get summary for each chunk
  const summaries = await Promise.all(
    chunks.map(chunk => getSummary(chunk))
  );

  // Combine summaries if multiple chunks
  if (summaries.length > 1) {
    return await getCombinedSummary(summaries.join('\n'));
  }

  return summaries[0];
}

async function getSummary(text) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: `Provide a comprehensive summary of this content, focusing on main points and key insights: ${text}`
    }]
  });

  return completion.choices[0].message.content;
}