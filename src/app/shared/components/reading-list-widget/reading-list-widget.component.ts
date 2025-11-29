import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReadingListService } from '../../../core/services';

@Component({
  selector: 'app-reading-list-widget',
  imports: [RouterLink],
  template: `
    <div class="h-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-surface-400 uppercase tracking-wider">Reading List</h2>
        @if (readingListService.unreadCount() > 0) {
          <span class="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded-full">
            {{ readingListService.unreadCount() }}
          </span>
        }
      </div>

      @if (readingListService.unreadItems().length > 0) {
        <div class="space-y-3">
          @for (item of readingListService.unreadItems().slice(0, 3); track item.id) {
            <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="block group">
              <article class="p-2 -mx-2 rounded-lg hover:bg-surface-800/30 transition-colors">
                <h3
                  class="text-sm text-surface-200 group-hover:text-accent-400 line-clamp-2 transition-colors"
                >
                  {{ item.title }}
                </h3>
                <p class="text-xs text-surface-500 mt-1">
                  {{ readingListService.getTimeAgo(item.savedAt) }}
                </p>
              </article>
            </a>
          }
        </div>

        @if (readingListService.unreadItems().length > 3) {
          <a
            routerLink="/reading-list"
            class="block mt-4 text-sm text-accent-400 hover:text-accent-300 transition-colors"
          >
            View all {{ readingListService.unreadItems().length }} items →
          </a>
        }
      } @else {
        <div class="text-center py-4">
          <p class="text-surface-500 text-sm">No saved articles</p>
          <a
            routerLink="/reading-list"
            class="inline-block mt-2 text-xs text-accent-400 hover:text-accent-300"
          >
            Add articles →
          </a>
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
  `,
})
export class ReadingListWidgetComponent {
  readonly readingListService = inject(ReadingListService);
}
