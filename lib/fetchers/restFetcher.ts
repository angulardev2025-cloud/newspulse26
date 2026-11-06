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

  let data: any = null;

  try {
    const res = await axios.get(url, {
      httpsAgent,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      timeout: 5000,
    });
    data = res.data;
  } catch (error: any) {
    // Smartly handle 403/errors: wait 3s before attempting proxy fallback
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Fallback to Proxy 1 (AllOrigins)
    try {
      const proxyUrl1 = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const proxyRes1 = await axios.get(proxyUrl1, { timeout: 7000 });
      data = proxyRes1.data;
    } catch (proxyErr1: any) {
      // 3. Fallback to Proxy 2 (CorsProxy.io)
      try {
        const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const proxyRes2 = await axios.get(proxyUrl2, { timeout: 7000 });
        data = proxyRes2.data;
      } catch (proxyErr2: any) {
        const errStatus = error.response?.status || proxyErr1.response?.status || proxyErr2.response?.status || (error.code === 'ECONNABORTED' ? 504 : 502);
        const errMsg = error.response?.data?.message || error.message || proxyErr1.message || proxyErr2.message || 'REST API feed request failed.';
        const fetchError: any = new Error(errMsg);
        fetchError.status = errStatus;
        fetchError.response = error.response || proxyErr1.response || proxyErr2.response;
        throw fetchError;
      }
    }
  }

  if (!data) return [];

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }

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
}
