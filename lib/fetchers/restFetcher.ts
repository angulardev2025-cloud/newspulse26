import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  ciphers: 'DEFAULT@SECLEVEL=1:ALL',
});

export async function fetchRest(endpoint: string, page: number) {
  let url = endpoint;
  if (endpoint.includes('?')) {
    if (!url.includes('page=')) {
      url += `&page=${page}`;
    } else {
      url = url.replace(/page=\d+/, `page=${page}`);
    }
  } else {
    url = `${endpoint}?page=${page}`;
  }

  let origin = 'https://google.com/';
  try {
    origin = new URL(endpoint).origin + '/';
  } catch (e) {}

  try {
    const res = await axios.get(url, {
      httpsAgent,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,kn;q=0.8',
        'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': origin,
        'Cache-Control': 'no-cache'
      },
      timeout: 6000,
    });

    const data = res.data;
    let items: any[] = [];
    
    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.value)) items = data.value;
      else if (Array.isArray(data.articles)) items = data.articles;
      else if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.posts)) items = data.posts;
      else if (Array.isArray(data.items)) items = data.items;
      else if (Array.isArray(data.result)) items = data.result;
    }

    const stripHtml = (html: any) => {
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
    };

    return items.map((item: any) => {
      if (!item || typeof item !== 'object') return null;

      const rawTitle = item.title?.rendered || item.title || item.headline || item.name || 'News';
      const rawExcerpt = item.excerpt?.rendered || item.description || item.summary || '';
      const rawContent = item.content?.rendered || item.content || '';
      
      let excerpt = stripHtml(rawExcerpt);
      if (!excerpt || excerpt.length < 30) {
        excerpt = stripHtml(rawContent).substring(0, 300);
      }

      const mediaUrl = item.image || item.urlToImage || item.thumbnail || item.featured_image || item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

      return {
        id: item.id || item._id || Math.random(),
        date: item.date || item.publishedAt || item.created_at || new Date().toISOString(),
        link: item.link || item.url || item.source_url || '#',
        title: { rendered: stripHtml(rawTitle) },
        excerpt: { rendered: excerpt },
        content: { rendered: typeof rawContent === 'string' ? rawContent : excerpt },
        _embedded: mediaUrl ? {
          'wp:featuredmedia': [{ source_url: mediaUrl }]
        } : undefined,
      };
    }).filter(Boolean);
  } catch (error: any) {
    // Silently handle restricted endpoints so wire remix continues
    return [];
  }
}
