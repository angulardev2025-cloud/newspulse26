import axios from 'axios';

export async function fetchRest(endpoint: string, page: number) {
  // Replace page/limit placeholders if present
  let url = endpoint.replace(/page=\d+/, `page=${page}`);
  
  const res = await axios.get(url, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,kn;q=0.8',
      'Referer': 'https://www.google.com/',
      'Cache-Control': 'no-cache'
    },
    timeout: 8000,
  });

  const data = res.data;
  let items = [];
  
  // Normalize various API response structures
  if (Array.isArray(data)) items = data;
  else if (data.value && Array.isArray(data.value)) items = data.value;
  else if (data.articles && Array.isArray(data.articles)) items = data.articles;
  else if (data.data && Array.isArray(data.data)) items = data.data;
  else if (data.posts && Array.isArray(data.posts)) items = data.posts;

  const stripHtml = (html: string) => {
    if (!html || typeof html !== 'string') return html;
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
    if (!excerpt || excerpt.length < 50) {
      excerpt = stripHtml(rawContent).substring(0, 300);
    }

    return {
      id: item.id || item._id || Math.random(),
      date: item.date || item.publishedAt || item.created_at || new Date().toISOString(),
      link: item.link || item.url || item.source_url || '#',
      title: { rendered: stripHtml(rawTitle) },
      excerpt: { rendered: excerpt },
      _embedded: {
        'wp:featuredmedia': [{ 
          source_url: item.image || item.urlToImage || item.thumbnail || item.featured_image || '' 
        }]
      }
    };
  }).filter(Boolean);
}
