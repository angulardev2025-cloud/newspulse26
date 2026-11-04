import axios from 'axios';

export async function fetchRest(endpoint: string, page: number) {
  // Replace page/limit placeholders if present
  let url = endpoint.replace(/page=\d+/, `page=${page}`);
  
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 5000,
  });

  const data = res.data;
  let items = [];
  
  // Normalize various API response structures
  if (Array.isArray(data)) items = data;
  else if (data.value && Array.isArray(data.value)) items = data.value;
  else if (data.articles && Array.isArray(data.articles)) items = data.articles;
  else if (data.data && Array.isArray(data.data)) items = data.data;
  else if (data.posts && Array.isArray(data.posts)) items = data.posts;

  return items.map((item: any) => ({
    id: item.id || item._id || Math.random(),
    date: item.date || item.publishedAt || item.created_at || new Date().toISOString(),
    link: item.link || item.url || item.source_url || '#',
    title: { rendered: item.title?.rendered || item.title || item.headline || item.name || 'News' },
    excerpt: { rendered: item.excerpt?.rendered || item.description || item.summary || item.content || '' },
    _embedded: {
      'wp:featuredmedia': [{ source_url: item.image || item.urlToImage || '/assets/aistudio/image_a4df1d8f.png' }]
    }
  }));
}
