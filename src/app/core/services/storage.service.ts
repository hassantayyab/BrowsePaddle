import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum StorageKey {
  Settings = 'bp_settings',
  QuickLinks = 'bp_quick_links',
  Bookmarks = 'bp_bookmarks',
  BookmarkFolders = 'bp_bookmark_folders',
  ReadingList = 'bp_reading_list',
  NewsSources = 'bp_news_sources',
  WeatherCache = 'bp_weather_cache',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  get<T>(key: StorageKey, defaultValue: T): T {
    if (!this.isBrowser) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: StorageKey, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
  }

  remove(key: StorageKey): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    // Only clear BrowsePaddle keys
    Object.values(StorageKey).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}


