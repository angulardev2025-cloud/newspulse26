export interface NewsSource {
  id: string;
  name: string;
  kannadaName: string;
  endpoint: string;
  description: string;
  category: string;
  language: 'kn' | 'en';
  type: 'wordpress' | 'rest';
  logo?: string;
}

// Master list of raw WordPress REST API v2 source URLs
export const RAW_SOURCE_URLS: string[] = [
  "https://tv9kannada.com/wp-json/tv9/v2/latest/all",
  "https://publictv.in/wp-json/wp/v2/posts",
  "https://www.vijayavani.net/wp-json/wp/v2/posts",
  "https://www.prajavani.net/wp-json/wp/v2/posts",
  "https://udupixpress.com/wp-json/wp/v2/posts",
  "https://udupitimes.com/wp-json/wp/v2/posts",
  "https://hosakannada.com/wp-json/wp/v2/posts",
  "https://dvgsuddi.com/wp-json/wp/v2/posts",
  "https://nammurexpress.in/wp-json/wp/v2/posts",
  "https://techcrunch.com/wp-json/wp/v2/posts",
  "https://npnewz.com/wp-json/wp/v2/posts",
  "https://www.mangalorean.com/wp-json/wp/v2/posts",
  "https://themangaloremirror.in/wp-json/wp/v2/posts",
  "https://belthangady.suddinews.com/wp-json/wp/v2/posts",
  "https://www.kahalenews.com/wp-json/wp/v2/posts",
  "https://tulunaduvarthe.com/wp-json/wp/v2/posts",
  "https://www.vishwanews24.com/wp-json/wp/v2/posts",
  "https://nammurexpress.com/wp-json/wp/v2/posts",
  "https://www.bangalorecitybus.in/wp-json/wp/v2/posts",
  "https://kannadanews.today/wp-json/wp/v2/posts",
  "https://kannadavani.news/wp-json/wp/v2/posts",
  "https://newskarkala.com/wp-json/wp/v2/posts",
  "https://prajasamaya.com/wp-json/wp/v2/posts",
  "https://pratikshana.com/wp-json/wp/v2/posts",
  "https://ts2.tech/wp-json/wp/v2/posts",
  "https://api.univest.in/wp-json/wp/v2/posts",
  "https://vijayatimes.com/wp-json/wp/v2/posts",
  "https://mangaloremirror.com/wp-json/wp/v2/posts",
  "https://www.dvgsuddi.com/wp-json/wp/v2/posts",
  "https://udupiexpress.com/wp-json/wp/v2/posts",
  "https://www.udayavani.com/wp-json/wp/v2/posts",
  "https://kannadaprabha.com/wp-json/wp/v2/posts",
  "https://suddinews.com/wp-json/wp/v2/posts",
  "https://www.vishwavani.news/wp-json/wp/v2/posts",
  "https://kahalenews.com/wp-json/wp/v2/posts",
];

// Optional overrides for branding, logos, and custom Kannada titles
const KNOWN_OVERRIDES: Record<string, Partial<NewsSource>> = {
  'tv9kannada-com': {
    id: 'tv9',
    name: 'TV9 Kannada',
    kannadaName: 'ಟಿವಿ೯ ಕನ್ನಡ',
    category: 'News',
    logo: '/assets/aistudio/images__1__7605c7ae.png',
  },
  'publictv-in': {
    id: 'public-tv',
    name: 'Public TV',
    kannadaName: 'ಪಬ್ಲಿಕ್ ಟಿವಿ',
    category: 'News',
    logo: '/assets/aistudio/images__2__608cc933.png',
  },
  'vijayavani-net': {
    id: 'vijayavani',
    name: 'Vijayavani',
    kannadaName: 'ವಿಜಯವಾಣಿ',
    category: 'Newspaper',
    logo: '/assets/aistudio/images__4__4cb37b0e.jpeg',
  },
  'prajavani-net': {
    id: 'prajavani',
    name: 'Prajavani',
    kannadaName: 'ಪ್ರಜಾವಾಣಿ',
    category: 'Newspaper',
    logo: '/assets/aistudio/images__2__07cf62ef.jpeg',
  },
  'udupixpress-com': {
    id: 'udupi-express',
    name: 'Udupi Express',
    kannadaName: 'ಉಡುಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    category: 'Coastal',
    logo: '/assets/aistudio/images__3__f45460f1.jpeg',
  },
  'udupiexpress-com': {
    id: 'udupi-express',
    name: 'Udupi Express',
    kannadaName: 'ಉಡುಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    category: 'Coastal',
    logo: '/assets/aistudio/images__3__f45460f1.jpeg',
  },
  'udupitimes-com': {
    id: 'udupi-times',
    name: 'Udupi Times',
    kannadaName: 'ಉಡುಪಿ ಟೈಮ್ಸ್',
    category: 'Coastal',
    logo: '/assets/aistudio/images__5__8a832d02.jpeg',
  },
  'hosakannada-com': {
    id: 'hosakannada',
    name: 'Hosa Kannada',
    kannadaName: 'ಹೊಸ ಕನ್ನಡ',
    category: 'Digital',
    logo: '/assets/aistudio/images__1__919b0bc9.jpeg',
  },
  'dvgsuddi-com': {
    name: 'DVG Suddi',
    kannadaName: 'ಡಿವಿಜಿ ಸುದ್ದಿ',
    category: 'Local',
  },
  'nammurexpress-in': {
    name: 'Nammur Express',
    kannadaName: 'ನಮ್ಮೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    category: 'Coastal',
  },
  'npnewz-com': {
    name: 'NP Newz',
    kannadaName: 'ಎನ್‌ಪಿ ನ್ಯೂಸ್',
    category: 'News',
  },
  'mangalorean-com': {
    name: 'Mangalorean',
    kannadaName: 'ಮಂಗಳೂರಿಯನ್',
    category: 'Coastal',
    language: 'en',
  },
  'themangaloremirror-in': {
    name: 'The Mangalore Mirror',
    kannadaName: 'ಮಂಗಳೂರು ಮಿರರ್',
    category: 'Coastal',
    language: 'en',
  },
  'belthangady-suddinews-com': {
    name: 'Belthangady Suddi',
    kannadaName: 'ಬೆಳ್ತಂಗಡಿ ಸುದ್ದಿ',
    category: 'Local',
  },
  'kahalenews-com': {
    name: 'Kahale News',
    kannadaName: 'ಕಹಳೆ ನ್ಯೂಸ್',
    category: 'News',
  },
  'tulunaduvarthe-com': {
    name: 'Tulunadu Varthe',
    kannadaName: 'ತುಳುನಾಡು ವಾರ್ತೆ',
    category: 'Coastal',
  },
  'vishwanews24-com': {
    name: 'Vishwa News 24',
    kannadaName: 'ವಿಶ್ವ ನ್ಯೂಸ್ 24',
    category: 'News',
  },
  'bangalorecitybus-in': {
    name: 'Bangalore City Bus',
    kannadaName: 'ಬೆಂಗಳೂರು ಸಿಟಿ ಬಸ್',
    category: 'Local',
  },
  'kannadanews-today': {
    name: 'Kannada News Today',
    kannadaName: 'ಕನ್ನಡ ನ್ಯೂಸ್ ಟುಡೇ',
    category: 'News',
  },
  'kannadavani-news': {
    name: 'Kannada Vani',
    kannadaName: 'ಕನ್ನಡ ವಾಣಿ',
    category: 'News',
  },
  'newskarkala-com': {
    name: 'News Karkala',
    kannadaName: 'ನ್ಯೂಸ್ ಕಾರ್ಕಳ',
    category: 'Coastal',
  },
  'prajasamaya-com': {
    name: 'Praja Samaya',
    kannadaName: 'ಪ್ರಜಾ ಸಮಯ',
    category: 'News',
  },
  'pratikshana-com': {
    name: 'Pratikshana',
    kannadaName: 'ಪ್ರತಿಕ್ಷಣ',
    category: 'News',
  },
  'vijayatimes-com': {
    name: 'Vijaya Times',
    kannadaName: 'ವಿಜಯ ಟೈಮ್ಸ್',
    category: 'News',
  },
  'udayavani-com': {
    name: 'Udayavani',
    kannadaName: 'ಉದಯವಾಣಿ',
    category: 'Newspaper',
  },
  'kannadaprabha-com': {
    name: 'Kannada Prabha',
    kannadaName: 'ಕನ್ನಡಪ್ರಭ',
    category: 'Newspaper',
  },
  'suddinews-com': {
    name: 'Suddi News',
    kannadaName: 'ಸುದ್ದಿ ನ್ಯೂಸ್',
    category: 'Local',
  },
  'vishwavani-news': {
    name: 'Vishwavani',
    kannadaName: 'ವಿಶ್ವವಾಣಿ',
    category: 'Newspaper',
  },
};

/**
 * Extracts the domain badge text from a URL (e.g. after www. and before .com/.in/.net)
 * Example: "https://www.udupitimes.com/..." => "UDUPITIMES"
 */
export function extractDomainBadge(url: string): string {
  if (!url || typeof url !== 'string') return 'NEWS';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, '');
    const domainName = host.split('.')[0];
    return domainName ? domainName.toUpperCase() : host.toUpperCase();
  } catch (e) {
    const match = url.match(/https?:\/\/(?:www\.)?([^/.]+)\./i);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }
    return 'NEWS';
  }
}

/**
 * Creates a normalized NewsSource object from any WordPress REST API URL.
 * Simply paste a URL to register a source dynamically.
 */
export function createSourceFromUrl(rawUrl: string, customOverrides: Partial<NewsSource> = {}): NewsSource {
  try {
    const cleanUrl = rawUrl.trim();
    const parsedUrl = new URL(cleanUrl);
    const host = parsedUrl.hostname.replace(/^www\./, '');
    const defaultId = host.replace(/\./g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase();

    // Derive title from hostname
    const mainDomain = host.split('.')[0];
    const derivedName = mainDomain
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const name = customOverrides.name || derivedName;
    const kannadaName = customOverrides.kannadaName || name;

    // Determine category dynamically
    let category = customOverrides.category || 'News';
    if (host.includes('udupi') || host.includes('mangalore') || host.includes('karkala') || host.includes('tulunadu') || host.includes('belthangady')) {
      category = 'Coastal';
    } else if (host.includes('tech') || host.includes('ts2')) {
      category = 'Tech';
    } else if (host.includes('bus') || host.includes('city') || host.includes('suddi')) {
      category = 'Local';
    } else if (host.includes('vijaya') || host.includes('praja') || host.includes('vishwa') || host.includes('prabha')) {
      category = 'Newspaper';
    }

    // Determine language
    const isEnglish = host.includes('mangalorean') || host.includes('techcrunch') || host.includes('ts2') || host.includes('univest');
    const language = customOverrides.language || (isEnglish ? 'en' : 'kn');

    return {
      id: customOverrides.id || defaultId,
      name,
      kannadaName,
      endpoint: cleanUrl,
      description: customOverrides.description || `${name} news wire.`,
      category,
      language,
      type: customOverrides.type || 'wordpress',
      logo: customOverrides.logo,
      ...customOverrides,
    };
  } catch (e) {
    const fallbackId = `source-${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: fallbackId,
      name: 'News Source',
      kannadaName: 'ಸುದ್ದಿ ಮೂಲ',
      endpoint: rawUrl,
      description: 'News wire endpoint.',
      category: 'General',
      language: 'kn',
      type: 'wordpress',
      ...customOverrides,
    };
  }
}

/**
 * Dynamically converts any array of raw source URLs into unified NewsSource definitions.
 * Deduplicates by ID/Domain.
 */
export function generateNewsSources(urls: string[]): NewsSource[] {
  const allWireSource: NewsSource = {
    id: 'all',
    name: 'All Coastal & Kannada Feeds',
    kannadaName: 'ಎಲ್ಲಾ ಕರಾವಳಿ ಮತ್ತು ಕನ್ನಡ ಸುದ್ದಿ ಮೂಲಗಳು',
    endpoint: '',
    description: 'Combined live wire across all Coastal and Kannada API endpoints.',
    category: 'General',
    language: 'kn',
    type: 'wordpress',
    logo: '/assets/aistudio/images_8efc4be7.png'
  };

  const seenIds = new Set<string>();
  const parsedSources: NewsSource[] = [];

  urls.forEach((url) => {
    try {
      const cleanUrl = url.trim().split('?')[0]; // Strip temporary pagination query params
      if (!cleanUrl) return;

      const host = new URL(cleanUrl).hostname.replace(/^www\./, '');
      const key = host.replace(/\./g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase();
      const overrides = KNOWN_OVERRIDES[key] || {};
      
      const source = createSourceFromUrl(cleanUrl, overrides);
      if (!seenIds.has(source.id)) {
        seenIds.add(source.id);
        parsedSources.push(source);
      }
    } catch (e) {
      console.error('Failed to parse URL into news source:', url);
    }
  });

  return [allWireSource, ...parsedSources];
}

// Single source of truth dynamically constructed from RAW_SOURCE_URLS
export const newsSources: NewsSource[] = generateNewsSources(RAW_SOURCE_URLS);
