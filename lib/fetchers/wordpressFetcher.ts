import axios from 'axios';

export async function fetchWordPress(endpoint: string, page: number) {
  let url = endpoint;
  if (endpoint.includes('?')) {
    url = endpoint.replace(/per_page=\d+/, 'per_page=15');
    if (!url.includes('page=')) {
      url += `&page=${page}`;
    } else {
      url = url.replace(/page=\d+/, `page=${page}`);
    }
  } else {
    url = `${endpoint}?per_page=15&page=${page}&_embed=true`;
  }

  let origin = 'https://google.com/';
  try {
    origin = new URL(endpoint).origin + '/';
  } catch (e) {}

  try {
    const res = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,kn;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': origin,
        'Cache-Control': 'max-age=0',
      },
      timeout: 6000, // 6s fast timeout
    });

    const data = res.data;
    let rawItems: any[] = [];
    
    if (Array.isArray(data)) {
      rawItems = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) rawItems = data.data;
      else if (Array.isArray(data.posts)) rawItems = data.posts;
      else if (Array.isArray(data.items)) rawItems = data.items;
      else if (Array.isArray(data.articles)) rawItems = data.articles;
      else if (Array.isArray(data.result)) rawItems = data.result;
      else if (Array.isArray(data.value)) rawItems = data.value;
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

    return rawItems.map((item: any) => {
      if (!item || typeof item !== 'object') return null;

      const rawTitle = item.title?.rendered || item.title || item.headline || item.name || 'News';
      const rawExcerpt = item.excerpt?.rendered || item.description || item.summary || '';
      const rawContent = item.content?.rendered || item.content || '';
      
      let excerpt = stripHtml(rawExcerpt);
      if (!excerpt || excerpt.length < 30) {
        excerpt = stripHtml(rawContent).substring(0, 300);
      }

      const mediaUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.image || item.featured_image || item.thumbnail || '';

      return {
        id: item.id || item._id || Math.random(),
        date: item.date || item.publishedAt || item.created_at || new Date().toISOString(),
        link: item.link || item.url || '#',
        title: { rendered: stripHtml(rawTitle) },
        excerpt: { rendered: excerpt },
        content: { rendered: typeof rawContent === 'string' ? rawContent : excerpt },
        _embedded: mediaUrl ? {
          'wp:featuredmedia': [{ source_url: mediaUrl }]
        } : item._embedded,
      };
    }).filter(Boolean);
  } catch (error: any) {
    console.warn(`[wordpressFetcher] Fetch skipped for ${endpoint}: ${error.message || error}`);
    return [];
  }
}
