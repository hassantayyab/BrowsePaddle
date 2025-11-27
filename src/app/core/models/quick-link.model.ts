export interface QuickLink {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  order: number;
}

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { id: '1', title: 'Gmail', url: 'https://mail.google.com', order: 0 },
  { id: '2', title: 'YouTube', url: 'https://youtube.com', order: 1 },
  { id: '3', title: 'GitHub', url: 'https://github.com', order: 2 },
  { id: '4', title: 'Reddit', url: 'https://reddit.com', order: 3 },
  { id: '5', title: 'Twitter', url: 'https://x.com', order: 4 },
  { id: '6', title: 'LinkedIn', url: 'https://linkedin.com', order: 5 },
];

