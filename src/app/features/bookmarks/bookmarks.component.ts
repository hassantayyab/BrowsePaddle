import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookmarksService } from '../../core/services';

@Component({
  selector: 'app-bookmarks',
  imports: [FormsModule, RouterLink],
  templateUrl: './bookmarks.component.html',
})
export class BookmarksComponent {
  readonly bookmarksService = inject(BookmarksService);

  readonly showAddBookmark = signal(false);
  readonly showAddFolder = signal(false);
  readonly editingBookmarkId = signal<string | null>(null);

  newBookmarkTitle = '';
  newBookmarkUrl = '';
  newFolderName = '';

  openAddBookmark(): void {
    this.showAddBookmark.set(true);
    this.newBookmarkTitle = '';
    this.newBookmarkUrl = '';
  }

  closeAddBookmark(): void {
    this.showAddBookmark.set(false);
  }

  addBookmark(event: Event): void {
    event.preventDefault();
    if (this.newBookmarkTitle.trim() && this.newBookmarkUrl.trim()) {
      this.bookmarksService.addBookmark({
        title: this.newBookmarkTitle.trim(),
        url: this.newBookmarkUrl.trim(),
        folderId: this.bookmarksService.selectedFolderId(),
      });
      this.closeAddBookmark();
    }
  }

  openAddFolder(): void {
    this.showAddFolder.set(true);
    this.newFolderName = '';
  }

  closeAddFolder(): void {
    this.showAddFolder.set(false);
  }

  addFolder(event: Event): void {
    event.preventDefault();
    if (this.newFolderName.trim()) {
      this.bookmarksService.addFolder({
        name: this.newFolderName.trim(),
        parentId: this.bookmarksService.selectedFolderId(),
      });
      this.closeAddFolder();
    }
  }

  deleteBookmark(id: string): void {
    this.bookmarksService.removeBookmark(id);
  }

  deleteFolder(id: string): void {
    this.bookmarksService.removeFolder(id);
  }

  navigateToFolder(folderId: string | null): void {
    this.bookmarksService.selectFolder(folderId);
  }

  exportBookmarks(): void {
    const data = this.bookmarksService.exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'browsepaddle-bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importBookmarks(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = reader.result as string;
      const success = this.bookmarksService.importBookmarks(json);
      if (!success) {
        alert('Failed to import bookmarks. Invalid file format.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
}
