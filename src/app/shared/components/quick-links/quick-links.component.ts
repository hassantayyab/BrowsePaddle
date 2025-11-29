import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuickLink } from '../../../core/models';
import { QuickLinksService } from '../../../core/services';

@Component({
  selector: 'app-quick-links',
  imports: [FormsModule, DragDropModule],
  template: `
    <div class="w-full">
      <div
        cdkDropList
        cdkDropListOrientation="horizontal"
        (cdkDropListDropped)="onDrop($event)"
        class="flex flex-wrap justify-center gap-4"
      >
        @for (link of quickLinksService.quickLinks(); track link.id) {
          <div cdkDrag class="group relative" [cdkDragDisabled]="isEditing()">
            <!-- Drag preview -->
            <div
              *cdkDragPlaceholder
              class="w-20 h-24 bg-surface-800/30 rounded-xl border-2 border-dashed border-surface-600"
            ></div>

            <!-- Link tile -->
            <a
              [href]="link.url"
              (click)="onLinkClick($event, link)"
              class="
                flex flex-col items-center justify-center
                w-20 h-24 p-3
                bg-surface-900/40 hover:bg-surface-800/60
                border border-surface-800/30 hover:border-surface-700/50
                rounded-xl
                transition-all duration-200
                cursor-pointer
                group-hover:scale-105
              "
              [class.cursor-move]="!isEditing()"
            >
              <div class="w-10 h-10 mb-2 flex items-center justify-center">
                @if (link.favicon || quickLinksService.getFaviconUrl(link.url)) {
                  <img
                    [src]="link.favicon || quickLinksService.getFaviconUrl(link.url)"
                    [alt]="link.title"
                    class="w-8 h-8 rounded-lg"
                    (error)="onImageError($event)"
                  />
                } @else {
                  <div
                    class="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-surface-400 text-sm font-medium"
                  >
                    {{ link.title.charAt(0).toUpperCase() }}
                  </div>
                }
              </div>
              <span class="text-xs text-surface-400 text-center truncate w-full">
                {{ link.title }}
              </span>
            </a>

            <!-- Edit/Delete buttons (shown on hover in edit mode) -->
            @if (isEditing()) {
              <button
                (click)="removeLink(link.id)"
                class="
                  absolute -top-2 -right-2
                  w-6 h-6 rounded-full
                  bg-red-500/90 hover:bg-red-500
                  text-white text-xs
                  flex items-center justify-center
                  shadow-lg
                  transition-all
                "
              >
                ×
              </button>
            }
          </div>
        }

        <!-- Add new link button -->
        <button
          (click)="openAddDialog()"
          class="
            flex flex-col items-center justify-center
            w-20 h-24 p-3
            bg-surface-900/20 hover:bg-surface-800/40
            border-2 border-dashed border-surface-700/50 hover:border-surface-600
            rounded-xl
            transition-all duration-200
            text-surface-500 hover:text-surface-400
          "
        >
          <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span class="text-xs">Add</span>
        </button>
      </div>

      <!-- Edit mode toggle -->
      <div class="flex justify-center mt-4">
        <button
          (click)="toggleEditMode()"
          class="
            text-xs text-surface-500 hover:text-surface-400
            px-3 py-1.5 rounded-lg
            hover:bg-surface-800/50
            transition-all
          "
        >
          {{ isEditing() ? 'Done editing' : 'Edit links' }}
        </button>
      </div>

      <!-- Add link dialog -->
      @if (showAddDialog()) {
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          (click)="closeAddDialog()"
        >
          <div
            class="bg-surface-900 border border-surface-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            (click)="$event.stopPropagation()"
          >
            <h3 class="text-lg font-medium text-surface-100 mb-4">Add Quick Link</h3>

            <form (submit)="addLink($event)">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-surface-400 mb-1">Title</label>
                  <input
                    type="text"
                    [(ngModel)]="newLinkTitle"
                    name="title"
                    placeholder="e.g., GitHub"
                    class="
                      w-full px-4 py-2.5
                      bg-surface-800 border border-surface-700
                      rounded-xl text-surface-100
                      placeholder:text-surface-500
                      focus:outline-none focus:ring-2 focus:ring-accent-500/50
                    "
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm text-surface-400 mb-1">URL</label>
                  <input
                    type="url"
                    [(ngModel)]="newLinkUrl"
                    name="url"
                    placeholder="https://github.com"
                    class="
                      w-full px-4 py-2.5
                      bg-surface-800 border border-surface-700
                      rounded-xl text-surface-100
                      placeholder:text-surface-500
                      focus:outline-none focus:ring-2 focus:ring-accent-500/50
                    "
                    required
                  />
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  (click)="closeAddDialog()"
                  class="
                    flex-1 px-4 py-2.5
                    bg-surface-800 hover:bg-surface-700
                    border border-surface-700
                    rounded-xl text-surface-300
                    transition-colors
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="
                    flex-1 px-4 py-2.5
                    bg-accent-500 hover:bg-accent-600
                    rounded-xl text-white font-medium
                    transition-colors
                  "
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    :host-context(html.light) a {
      background-color: rgba(255, 255, 255, 0.6);
      border-color: rgba(228, 228, 231, 0.5);
    }

    :host-context(html.light) a:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }

    :host-context(html.light) .bg-surface-900 {
      background-color: #ffffff;
    }

    :host-context(html.light) .bg-surface-800 {
      background-color: #f4f4f5;
    }
  `,
})
export class QuickLinksComponent {
  readonly quickLinksService = inject(QuickLinksService);

  readonly isEditing = signal(false);
  readonly showAddDialog = signal(false);

  newLinkTitle = '';
  newLinkUrl = '';

  onDrop(event: CdkDragDrop<QuickLink[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      this.quickLinksService.reorderLinks(event.previousIndex, event.currentIndex);
    }
  }

  onLinkClick(event: Event, _link: QuickLink): void {
    if (this.isEditing()) {
      event.preventDefault();
    }
  }

  toggleEditMode(): void {
    this.isEditing.update((v) => !v);
  }

  removeLink(id: string): void {
    this.quickLinksService.removeLink(id);
  }

  openAddDialog(): void {
    this.showAddDialog.set(true);
    this.newLinkTitle = '';
    this.newLinkUrl = '';
  }

  closeAddDialog(): void {
    this.showAddDialog.set(false);
  }

  addLink(event: Event): void {
    event.preventDefault();

    if (this.newLinkTitle.trim() && this.newLinkUrl.trim()) {
      this.quickLinksService.addLink({
        title: this.newLinkTitle.trim(),
        url: this.newLinkUrl.trim(),
      });
      this.closeAddDialog();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
