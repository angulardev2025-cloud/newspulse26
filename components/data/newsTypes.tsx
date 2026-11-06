export interface NewsItem {
    name: string;
    url: string;
    image?: {
      thumbnail?: {
        contentUrl?: string;
      };
    };
    description: string;
    datePublished: string;
    provider: {
      name: string;
    }[];
    category?: string;
    content?: string;
  }

export interface WordPressPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
    }>;
  };
  customSourceName?: string;
  customSourceLogo?: string;
  customDomainBadge?: string;
}

export interface ApiErrorInfo {
  status: number | string;
  statusText?: string;
  message: string;
  endpoint?: string;
  sourceId?: string;
  sourceName?: string;
  timestamp?: string;
  details?: string;
}