import axios from 'axios';

export async function fetchWordPress(endpoint: string, page: number) {
  const url = endpoint.includes('?') 
    ? endpoint.replace(/per_page=\d+/, 'per_page=15') + `&page=${page}`
    : `${endpoint}?per_page=15&page=${page}&_embed=true`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 5000,
  });

  return (res.data || []).map((item: any) => ({
    id: item.id,
    date: item.date,
    link: item.link,
    title: { rendered: item.title?.rendered || 'News' },
    excerpt: { rendered: item.excerpt?.rendered || '' },
    content: { rendered: item.content?.rendered || '' },
    _embedded: item._embedded,
  }));
}
