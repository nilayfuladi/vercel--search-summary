export async function generateOutline($) {
    const outline = [];
    const headings = $('h1, h2, h3, h4, h5, h6');
    
    headings.each((index, element) => {
      const $heading = $(element);
      const level = parseInt(element.tagName.substring(1));
      const text = $heading.text().trim();
      
      // Generate or get ID for navigation
      let id = $heading.attr('id');
      if (!id) {
        id = `section-${index}`;
        $heading.attr('id', id);
      }
  
      outline.push({
        level,
        text,
        id
      });
    });
  
    return outline;
  }
  
  // Helper functions
  function splitIntoChunks(text, maxLength) {
    const chunks = [];
    let current = '';
    const sentences = text.split(/(?<=[.!?])\s+/);
  
    for (const sentence of sentences) {
      if ((current + sentence).length <= maxLength) {
        current += sentence + ' ';
      } else {
        chunks.push(current.trim());
        current = sentence + ' ';
      }
    }
    
    if (current.trim()) {
      chunks.push(current.trim());
    }
  
    return chunks;
  }
  
  function getAbsoluteUrl(relativeUrl, baseUrl) {
    if (!relativeUrl) return null;
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch {
      return null;
    }
  }
  
  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }
  
  function isValidLink(url) {
    return url && url.startsWith('http');
  }