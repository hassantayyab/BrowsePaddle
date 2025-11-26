import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../core/services';

@Component({
  selector: 'app-news-feed',
  imports: [],
  template: `
    <div class="h-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-surface-400 uppercase tracking-wider">News</h2>
        <button
          (click)="refresh()"
          class="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
          [class.animate-spin]="newsService.loading()"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      @if (newsService.loading() && newsService.news().length === 0) {
        <div class="flex items-center justify-center h-24">
          <div class="w-6 h-6 border-2 border-surface-600 border-t-accent-500 rounded-full animate-spin"></div>
        </div>
      } @else if (newsService.error() && newsService.news().length === 0) {
        <div class="text-center py-4">
          <p class="text-surface-500 text-sm">{{ newsService.error() }}</p>
        </div>
      } @else if (newsService.news().length === 0) {
        <div class="text-center py-4">
          <p class="text-surface-500 text-sm mb-3">No news available</p>
          <button
            (click)="newsService.fetchNews()"
            class="px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-sm text-surface-300 transition-colors"
          >
            Load News
          </button>
        </div>
      } @else {
        <div class="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          @for (item of newsService.news().slice(0, 5); track item.id) {
            <a
              [href]="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block group"
            >
              <article class="p-2 -mx-2 rounded-lg hover:bg-surface-800/30 transition-colors">
                <h3 class="text-sm text-surface-200 group-hover:text-accent-400 line-clamp-2 transition-colors">
                  {{ item.title }}
                </h3>
                <div class="flex items-center gap-2 mt-1.5 text-xs text-surface-500">
                  <span class="font-medium">{{ item.source }}</span>
                  <span>•</span>
                  <span>{{ newsService.getTimeAgo(item.publishedAt) }}</span>
                </div>
              </article>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--color-surface-700);
      border-radius: 2px;
    }
  `,
})
export class NewsFeedComponent implements OnInit {
  readonly newsService = inject(NewsService);

  ngOnInit(): void {
    if (this.newsService.news().length === 0) {
      this.newsService.fetchNews();
    }
  }

  refresh(): void {
    this.newsService.refresh();
  }
}

