import axios from 'axios';

export async function fetchWordPress(endpoint: string, page: number) {
  const url = endpoint.includes('?') 
    ? endpoint.replace(/per_page=\d+/, 'per_page=15') + `&page=${page}`
    : `${endpoint}?per_page=15&page=${page}&_embed=true`;

  const res = await axios.get(url, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,kn;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': new URL(endpoint).origin + '/',
      'Cache-Control': 'max-age=0',
    },
    timeout: 10000,
  });

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  return (res.data || []).map((item: any) => {
    if (!item || typeof item !== 'object') return null;
    const title = stripHtml(item.title?.rendered || 'News');
    const excerptRaw = item.excerpt?.rendered || '';
    const contentRaw = item.content?.rendered || '';
    
    let excerpt = stripHtml(excerptRaw);
    if (!excerpt || excerpt.length < 50) {
      excerpt = stripHtml(contentRaw).substring(0, 300);
    }

    return {
      id: item.id || Math.random(),
      date: item.date || new Date().toISOString(),
      link: item.link || '#',
      title: { rendered: title },
      excerpt: { rendered: excerpt },
      content: { rendered: contentRaw }, // Keep raw content for modal if needed, but stripped version is used in reader
      _embedded: item._embedded,
    };
  }).filter(Boolean);
}
