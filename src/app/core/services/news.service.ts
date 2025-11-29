import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService, StorageKey } from './storage.service';
import { NewsItem, NewsSource, DEFAULT_NEWS_SOURCES } from '../models';
import { catchError, forkJoin, of, map } from 'rxjs';

interface Rss2JsonResponse {
  status: string;
  feed: {
    title: string;
    link: string;
  };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    description: string;
    thumbnail?: string;
    enclosure?: { link: string };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  private readonly _sources = signal<NewsSource[]>(this.loadSources());
  private readonly _news = signal<NewsItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly sources = this._sources.asReadonly();
  readonly news = this._news.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    effect(() => {
      const sources = this._sources();
      this.storage.set(StorageKey.NewsSources, sources);
    });
  }

  private loadSources(): NewsSource[] {
    return this.storage.get<NewsSource[]>(StorageKey.NewsSources, DEFAULT_NEWS_SOURCES);
  }

  fetchNews(): void {
    const enabledSources = this._sources().filter((s) => s.enabled);

    if (enabledSources.length === 0) {
      this._news.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    const requests = enabledSources.map((source) =>
      this.fetchFeed(source).pipe(
        catchError(() => of([]))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const allNews = results
          .flat()
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 20);

        this._news.set(allNews);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to fetch news');
        this._loading.set(false);
      },
    });
  }

  private fetchFeed(source: NewsSource) {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.feedUrl)}`;

    return this.http.get<Rss2JsonResponse>(url).pipe(
      map((response) => {
        if (response.status !== 'ok') {
          return [];
        }

        return response.items.slice(0, 5).map((item) => ({
          id: `${source.id}-${item.link}`,
          title: this.stripHtml(item.title),
          description: this.stripHtml(item.description).slice(0, 150),
          url: item.link,
          source: source.name,
          publishedAt: item.pubDate,
          imageUrl: item.thumbnail || item.enclosure?.link,
        }));
      }),
      catchError(() => of([]))
    );
  }

  private stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  toggleSource(sourceId: string): void {
    this._sources.update((sources) =>
      sources.map((s) => (s.id === sourceId ? { ...s, enabled: !s.enabled } : s))
    );
  }

  addSource(source: Omit<NewsSource, 'id'>): void {
    const newSource: NewsSource = {
      ...source,
      id: crypto.randomUUID(),
    };
    this._sources.update((sources) => [...sources, newSource]);
  }

  removeSource(sourceId: string): void {
    this._sources.update((sources) => sources.filter((s) => s.id !== sourceId));
  }

  resetToDefaults(): void {
    this._sources.set(DEFAULT_NEWS_SOURCES);
  }

  refresh(): void {
    this.fetchNews();
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }
}



