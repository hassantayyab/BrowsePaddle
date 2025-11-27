export interface ReadingListItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  isRead: boolean;
  savedAt: number;
  readAt?: number;
}

