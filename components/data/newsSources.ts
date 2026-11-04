export interface NewsSource {
  id: string;
  name: string;
  kannadaName: string;
  endpoint: string;
  description: string;
  category: string;
  language: 'kn' | 'en';
  type: 'wordpress' | 'rest';
}

export const newsSources: NewsSource[] = [
  {
    id: 'all',
    name: 'All Aggregated Feeds',
    kannadaName: 'ಎಲ್ಲಾ ಸುದ್ದಿ ಮೂಲಗಳು',
    endpoint: '',
    description: 'Combined live wire across all absolute API endpoints.',
    category: 'General',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'liquide',
    name: 'Liquide News API',
    kannadaName: 'ಲಿಕ್ವಿಡ್ ನ್ಯೂಸ್ API',
    endpoint: 'https://api.v2.liquide.life/api/news?page=1&limit=10',
    description: 'Financial and market news updates from Liquide.',
    category: 'Finance',
    language: 'en',
    type: 'rest'
  },
  {
    id: 'tv9',
    name: 'TV9 Kannada',
    kannadaName: 'ಟಿವಿ೯ ಕನ್ನಡ',
    endpoint: 'https://tv9kannada.com/wp-json/wp/v2/posts?per_page=15&_embed=true',
    description: '24/7 Kannada news channel.',
    category: 'News',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'public-tv',
    name: 'Public TV',
    kannadaName: 'ಪಬ್ಲಿಕ್ ಟಿವಿ',
    endpoint: 'https://publictv.in/wp-json/wp/v2/posts?per_page=15&_embed=true',
    description: 'Popular Kannada news broadcaster.',
    category: 'News',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'vijayavani',
    name: 'Vijayavani',
    kannadaName: 'ವಿಜಯವಾಣಿ',
    endpoint: 'https://www.vijayavani.net/wp-json/wp/v2/posts?per_page=15&_embed=true',
    description: 'Widely circulated Kannada daily.',
    category: 'Newspaper',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'lallantop',
    name: 'The Lallantop',
    kannadaName: 'ದಿ ಲಲ್ಲಂಟಾಪ್',
    endpoint: 'https://api.thelallantop.com/api/v1/posts?per_page=10',
    description: 'National political analysis.',
    category: 'National',
    language: 'kn',
    type: 'rest'
  },
  {
    id: 'espn',
    name: 'ESPN Sports',
    kannadaName: 'ಇಎಸ್‌ಪಿಎನ್ ಕ್ರೀಡೆ',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/news?limit=10',
    description: 'Global sports news.',
    category: 'Sports',
    language: 'en',
    type: 'rest'
  },
  {
    id: 'cnbc',
    name: 'CNBC TV18',
    kannadaName: 'ಸಿಎನ್‌ಬಿಸಿ ಟಿವಿ೧೮',
    endpoint: 'https://api-en.cnbctv18.com/api/v1/news?limit=10',
    description: 'Business news and insights.',
    category: 'Business',
    language: 'en',
    type: 'rest'
  },
  {
    id: 'ottplay',
    name: 'OTTPlay',
    kannadaName: 'ಒಟಿಟಿಪ್ಲೇ ಮನರಂಜನೆ',
    endpoint: 'https://api2.ottplay.com/v1/news?limit=10',
    description: 'Entertainment and streaming reviews.',
    category: 'Entertainment',
    language: 'en',
    type: 'rest'
  },
  {
    id: 'udupi-express',
    name: 'Udupi Express',
    kannadaName: 'ಉಡುಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    endpoint: 'https://udupixpress.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Coastal Karnataka news.',
    category: 'Coastal',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'nammurexpress',
    name: 'Nammur Express',
    kannadaName: 'ನಮ್ಮೂರ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    endpoint: 'https://nammurexpress.in/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Local Karnataka district news.',
    category: 'Local',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'udupi-times',
    name: 'Udupi Times',
    kannadaName: 'ಉಡುಪಿ ಟೈಮ್ಸ್',
    endpoint: 'https://udupitimes.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Udupi regional news.',
    category: 'Coastal',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'dvgsuddi',
    name: 'DVG Suddi',
    kannadaName: 'ಡಿವಿಜಿ ಸುದ್ದಿ',
    endpoint: 'https://dvgsuddi.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Davangere news.',
    category: 'Regional',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'hosakannada',
    name: 'Hosa Kannada',
    kannadaName: 'ಹೊಸ ಕನ್ನಡ',
    endpoint: 'https://hosakannada.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Digital analysis.',
    category: 'Digital',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'mangalorean',
    name: 'Mangalorean',
    kannadaName: 'ಮಂಗಳೂರಿಯನ್',
    endpoint: 'https://www.mangalorean.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Mangalore news.',
    category: 'Coastal',
    language: 'en',
    type: 'wordpress'
  },
  {
    id: 'mangaloremirror',
    name: 'The Mangalore Mirror',
    kannadaName: 'ಮಂಗಳೂರು ಮಿರರ್',
    endpoint: 'https://themangaloremirror.in/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Coastal Karnataka affairs.',
    category: 'Coastal',
    language: 'en',
    type: 'wordpress'
  },
  {
    id: 'suddinews',
    name: 'Belthangady Suddi',
    kannadaName: 'ಬೆಳ್ತಂಗಡಿ ಸುದ್ದಿ',
    endpoint: 'https://belthangady.suddinews.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Belthangady updates.',
    category: 'Local',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'kahalenews',
    name: 'Kahale News',
    kannadaName: 'ಕಾಹಳೆ ಸುದ್ದಿ',
    endpoint: 'https://www.kahalenews.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Investigative stories.',
    category: 'News',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'tulunadu',
    name: 'Tulunadu Varthe',
    kannadaName: 'ತುಳುನಾಡು ವಾರ್ತೆ',
    endpoint: 'https://tulunaduvarthe.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Tulunadu culture.',
    category: 'Coastal',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'vishwanews',
    name: 'Vishwa News 24',
    kannadaName: 'ವಿಶ್ವ ನ್ಯೂಸ್ ೨೪',
    endpoint: 'https://www.vishwanews24.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Global news.',
    category: 'Global',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'npnewz',
    name: 'NP Newz',
    kannadaName: 'ಎನ್ಪಿ ನ್ಯೂಸ್',
    endpoint: 'https://npnewz.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'National updates.',
    category: 'Digital',
    language: 'kn',
    type: 'wordpress'
  },
  {
    id: 'prajavani',
    name: 'Prajavani',
    kannadaName: 'ಪ್ರಜಾವಾಣಿ',
    endpoint: 'https://www.prajavani.net/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Kannada daily.',
    category: 'Newspaper',
    language: 'kn',
    type: 'wordpress'
  }
];
