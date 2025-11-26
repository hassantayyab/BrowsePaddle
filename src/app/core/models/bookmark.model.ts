export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId: string | null;
  createdAt: number;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
}
