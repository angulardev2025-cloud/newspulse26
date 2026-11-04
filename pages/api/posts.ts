import { NextApiRequest, NextApiResponse } from 'next';
import { newsSources } from '../../components/data/newsSources';
import { fetchWordPress } from '../../lib/fetchers/wordpressFetcher';
import { fetchRest } from '../../lib/fetchers/restFetcher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { source, page = '1' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const targetSource = newsSources.find(s => s.id === source);

  try {
    let posts: any[] = [];
    
    if (targetSource && targetSource.endpoint) {
      if (targetSource.type === 'wordpress') {
        posts = await fetchWordPress(targetSource.endpoint, pageNum);
      } else {
        posts = await fetchRest(targetSource.endpoint, pageNum);
      }
    } else {
      // Default: Aggregate from key sources
      const sourcesToFetch = newsSources.filter(s => s.id !== 'all').slice(0, 3);
      const results = await Promise.all(
        sourcesToFetch.map(s => 
          (s.type === 'wordpress' ? fetchWordPress(s.endpoint, pageNum) : fetchRest(s.endpoint, pageNum))
            .catch(() => [])
        )
      );
      results.forEach(r => posts = posts.concat(r));
    }

    return res.status(200).json(posts);
  } catch (error: any) {
    console.error('API Fetch Error:', error.message);
    return res.status(200).json([]);
  }
}
