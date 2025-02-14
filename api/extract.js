import { URL } from 'url';

export async function extractMedia($, baseUrl) {
  const media = {
    images: [],
    videos: [],
    links: []
  };

  // Extract images
  $('img').each((_, element) => {
    const img = $(element);
    const src = img.attr('src');
    
    if (src && !src.startsWith('data:') && !isSmallImage(img)) {
      try {
        const absoluteSrc = new URL(src, baseUrl).href;
        media.images.push({
          src: absoluteSrc,
          alt: img.attr('alt') || '',
          width: img.attr('width'),
          height: img.attr('height')
        });
      } catch (e) {
        console.error('Error processing image URL:', e);
      }
    }
  });

  // Extract videos
  $('iframe[src*="youtube"], iframe[src*="vimeo"], video').each((_, element) => {
    const video = $(element);
    const src = video.attr('src');
    
    if (src) {
      try {
        const absoluteSrc = new URL(src, baseUrl).href;
        media.videos.push({
          src: absoluteSrc,
          type: video.prop('tagName').toLowerCase()
        });
      } catch (e) {
        console.error('Error processing video URL:', e);
      }
    }
  });

  // Extract important links
  $('a').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        const absoluteHref = new URL(href, baseUrl).href;
        media.links.push({
          href: absoluteHref,
          text: link.text().trim()
        });
      } catch (e) {
        console.error('Error processing link URL:', e);
      }
    }
  });

  return media;
}

function isSmallImage(img) {
  const width = parseInt(img.attr('width'));
  const height = parseInt(img.attr('height'));
  
  // Filter out small icons and decorative images
  if (width && height) {
    return width < 100 || height < 100;
  }
  
  return false;
}