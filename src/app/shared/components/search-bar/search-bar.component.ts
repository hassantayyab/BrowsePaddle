import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services';
import { SearchEngine } from '../../../core/models';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  template: `
    <form (submit)="onSearch($event)" class="w-full max-w-2xl mx-auto">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            class="w-5 h-5 text-surface-500 group-focus-within:text-accent-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          [(ngModel)]="query"
          name="query"
          placeholder="Search the web..."
          autocomplete="off"
          class="
            w-full pl-12 pr-4 py-4
            bg-surface-900/50 dark:bg-surface-800/50
            border border-surface-700/50 dark:border-surface-700/30
            rounded-2xl
            text-surface-100 dark:text-surface-200
            placeholder:text-surface-500
            focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-transparent
            transition-all duration-200
            backdrop-blur-sm
          "
        />
        <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span class="text-xs text-surface-600 uppercase tracking-wider">
            {{ searchEngine() }}
          </span>
        </div>
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }

    :host-context(html.light) input {
      background-color: rgba(255, 255, 255, 0.8);
      border-color: rgba(228, 228, 231, 0.5);
      color: #18181b;
    }

    :host-context(html.light) input::placeholder {
      color: #a1a1aa;
    }
  `,
})
export class SearchBarComponent {
  private readonly settings = inject(SettingsService);

  readonly searchEngine = this.settings.searchEngine;
  query = '';

  onSearch(event: Event): void {
    event.preventDefault();

    if (!this.query.trim()) return;

    const searchUrl = this.getSearchUrl(this.searchEngine(), this.query);
    window.open(searchUrl, '_self');
  }

  private getSearchUrl(engine: SearchEngine, query: string): string {
    const encodedQuery = encodeURIComponent(query);

    switch (engine) {
      case 'google':
        return `https://www.google.com/search?q=${encodedQuery}`;
      case 'duckduckgo':
        return `https://duckduckgo.com/?q=${encodedQuery}`;
      case 'bing':
        return `https://www.bing.com/search?q=${encodedQuery}`;
      default:
        return `https://www.google.com/search?q=${encodedQuery}`;
    }
  }
}
