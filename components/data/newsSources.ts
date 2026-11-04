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
    name: 'All Coastal & Kannada Feeds',
    kannadaName: 'ಎಲ್ಲಾ ಕರಾವಳಿ ಮತ್ತು ಕನ್ನಡ ಸುದ್ದಿ ಮೂಲಗಳು',
    endpoint: '',
    description: 'Combined live wire across all Coastal and Kannada API endpoints.',
    category: 'General',
    language: 'kn',
    type: 'wordpress'
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
    id: 'prajavani',
    name: 'Prajavani',
    kannadaName: 'ಪ್ರಜಾವಾಣಿ',
    endpoint: 'https://www.prajavani.net/wp-json/wp/v2/posts?per_page=15&_embed=true',
    description: 'Kannada daily.',
    category: 'Newspaper',
    language: 'kn',
    type: 'wordpress'
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
    id: 'hosakannada',
    name: 'Hosa Kannada',
    kannadaName: 'ಹೊಸ ಕನ್ನಡ',
    endpoint: 'https://hosakannada.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    description: 'Digital analysis.',
    category: 'Digital',
    language: 'kn',
    type: 'wordpress'
  }
];
