import axios from 'axios';
import https from 'https';

// Custom HTTPS Agent to handle legacy SSL ciphers and prevent EPROTO / SSL alert 80 errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  ciphers: 'DEFAULT@SECLEVEL=1:ALL',
});

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

  let data: any = null;

  // 1. Try direct axios request
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
        const errMsg = error.response?.data?.message || error.message || proxyErr1.message || proxyErr2.message || 'WordPress feed request failed.';
        const fetchError: any = new Error(errMsg);
        fetchError.status = errStatus;
        fetchError.response = error.response || proxyErr1.response || proxyErr2.response;
        throw fetchError;
      }
    }
  }

  if (!data) return [];

  // If proxy returned string JSON, parse it
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }

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

    const mediaUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.image || item.urlToImage || item.featured_image || item.thumbnail || '';

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
}
