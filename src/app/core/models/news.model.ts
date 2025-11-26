export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  feedUrl: string;
  enabled: boolean;
}

export const DEFAULT_NEWS_SOURCES: NewsSource[] = [
  {
    id: 'hackernews',
    name: 'Hacker News',
    feedUrl: 'https://hnrss.org/frontpage',
    enabled: true,
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    feedUrl: 'https://techcrunch.com/feed/',
    enabled: true,
  },
  {
    id: 'theverge',
    name: 'The Verge',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    enabled: false,
  },
];
