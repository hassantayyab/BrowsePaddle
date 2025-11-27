import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { StorageService, StorageKey } from './storage.service';
import { ReadingListItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReadingListService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<ReadingListItem[]>(this.loadItems());

  readonly items = this._items.asReadonly();

  readonly unreadItems = computed(() =>
    this._items()
      .filter((item) => !item.isRead)
      .sort((a, b) => b.savedAt - a.savedAt)
  );

  readonly readItems = computed(() =>
    this._items()
      .filter((item) => item.isRead)
      .sort((a, b) => (b.readAt || 0) - (a.readAt || 0))
  );

  readonly unreadCount = computed(() => this.unreadItems().length);

  constructor() {
    effect(() => {
      const items = this._items();
      this.storage.set(StorageKey.ReadingList, items);
    });
  }

  private loadItems(): ReadingListItem[] {
    return this.storage.get<ReadingListItem[]>(StorageKey.ReadingList, []);
  }

  addItem(item: Omit<ReadingListItem, 'id' | 'savedAt' | 'isRead'>): void {
    // Check if URL already exists
    const exists = this._items().some((i) => i.url === item.url);
    if (exists) return;

    const newItem: ReadingListItem = {
      ...item,
      id: crypto.randomUUID(),
      savedAt: Date.now(),
      isRead: false,
    };
    this._items.update((items) => [newItem, ...items]);
  }

  updateItem(id: string, updates: Partial<Omit<ReadingListItem, 'id' | 'savedAt'>>): void {
    this._items.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  removeItem(id: string): void {
    this._items.update((items) => items.filter((item) => item.id !== id));
  }

  toggleRead(id: string): void {
    this._items.update((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: !item.isRead,
              readAt: !item.isRead ? Date.now() : undefined,
            }
          : item
      )
    );
  }

  markAsRead(id: string): void {
    this._items.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, isRead: true, readAt: Date.now() }
          : item
      )
    );
  }

  markAsUnread(id: string): void {
    this._items.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, isRead: false, readAt: undefined }
          : item
      )
    );
  }

  clearRead(): void {
    this._items.update((items) => items.filter((item) => !item.isRead));
  }

  clearAll(): void {
    this._items.set([]);
  }

  getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  }

  getTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(timestamp).toLocaleDateString();
  }
}


