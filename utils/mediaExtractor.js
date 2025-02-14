export async function extractMedia($, baseUrl) {
    const images = [];
    const videos = [];
    const links = [];
  
    // Extract images
    $('img').each((_, element) => {
      const img = $(element);
      const src = getAbsoluteUrl(img.attr('src'), baseUrl);
      const alt = img.attr('alt') || '';
      
      if (src && isValidImage(src)) {
        images.push({ src, alt });
      }
    });
  
    // Extract videos
    $('iframe[src*="youtube"], iframe[src*="vimeo"], video').each((_, element) => {
      const video = $(element);
      const src = getAbsoluteUrl(video.attr('src'), baseUrl);
      const type = video.prop('tagName').toLowerCase();
      
      if (src) {
        videos.push({ src, type });
      }
    });
  
    // Extract links
    $('a').each((_, element) => {
      const link = $(element);
      const href = getAbsoluteUrl(link.attr('href'), baseUrl);
      const text = link.text().trim();
      
      if (href && isValidLink(href)) {
        links.push({ href, text });
      }
    });
  
    return { images, videos, links };
  }