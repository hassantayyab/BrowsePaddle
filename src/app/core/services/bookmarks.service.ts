import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { StorageService, StorageKey } from './storage.service';
import { Bookmark, BookmarkFolder } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private readonly storage = inject(StorageService);

  private readonly _bookmarks = signal<Bookmark[]>(this.loadBookmarks());
  private readonly _folders = signal<BookmarkFolder[]>(this.loadFolders());
  private readonly _selectedFolderId = signal<string | null>(null);

  readonly bookmarks = this._bookmarks.asReadonly();
  readonly folders = this._folders.asReadonly();
  readonly selectedFolderId = this._selectedFolderId.asReadonly();

  readonly filteredBookmarks = computed(() => {
    const folderId = this._selectedFolderId();
    return this._bookmarks().filter((b) => b.folderId === folderId);
  });

  readonly rootBookmarks = computed(() => {
    return this._bookmarks().filter((b) => b.folderId === null);
  });

  readonly rootFolders = computed(() => {
    return this._folders().filter((f) => f.parentId === null).sort((a, b) => a.order - b.order);
  });

  constructor() {
    effect(() => {
      const bookmarks = this._bookmarks();
      this.storage.set(StorageKey.Bookmarks, bookmarks);
    });

    effect(() => {
      const folders = this._folders();
      this.storage.set(StorageKey.BookmarkFolders, folders);
    });
  }

  private loadBookmarks(): Bookmark[] {
    return this.storage.get<Bookmark[]>(StorageKey.Bookmarks, []);
  }

  private loadFolders(): BookmarkFolder[] {
    return this.storage.get<BookmarkFolder[]>(StorageKey.BookmarkFolders, []);
  }

  // Bookmark operations
  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): void {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    this._bookmarks.update((b) => [...b, newBookmark]);
  }

  updateBookmark(id: string, updates: Partial<Omit<Bookmark, 'id' | 'createdAt'>>): void {
    this._bookmarks.update((bookmarks) =>
      bookmarks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }

  removeBookmark(id: string): void {
    this._bookmarks.update((b) => b.filter((bookmark) => bookmark.id !== id));
  }

  moveBookmark(bookmarkId: string, folderId: string | null): void {
    this._bookmarks.update((bookmarks) =>
      bookmarks.map((b) => (b.id === bookmarkId ? { ...b, folderId } : b))
    );
  }

  // Folder operations
  addFolder(folder: Omit<BookmarkFolder, 'id' | 'order'>): void {
    const existingFolders = this._folders().filter((f) => f.parentId === folder.parentId);
    const newFolder: BookmarkFolder = {
      ...folder,
      id: crypto.randomUUID(),
      order: existingFolders.length,
    };
    this._folders.update((f) => [...f, newFolder]);
  }

  updateFolder(id: string, updates: Partial<Omit<BookmarkFolder, 'id'>>): void {
    this._folders.update((folders) =>
      folders.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }

  removeFolder(id: string): void {
    // Move all bookmarks in this folder to root
    this._bookmarks.update((bookmarks) =>
      bookmarks.map((b) => (b.folderId === id ? { ...b, folderId: null } : b))
    );
    // Remove the folder
    this._folders.update((f) => f.filter((folder) => folder.id !== id));
  }

  selectFolder(folderId: string | null): void {
    this._selectedFolderId.set(folderId);
  }

  getBookmarksByFolder(folderId: string | null): Bookmark[] {
    return this._bookmarks().filter((b) => b.folderId === folderId);
  }

  getSubfolders(parentId: string | null): BookmarkFolder[] {
    return this._folders()
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  }

  // Import/Export
  exportBookmarks(): string {
    const data = {
      bookmarks: this._bookmarks(),
      folders: this._folders(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBookmarks(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        this._bookmarks.set(data.bookmarks);
      }
      if (data.folders && Array.isArray(data.folders)) {
        this._folders.set(data.folders);
      }
      return true;
    } catch {
      return false;
    }
  }

  clearAll(): void {
    this._bookmarks.set([]);
    this._folders.set([]);
    this._selectedFolderId.set(null);
  }

  getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  }
}



