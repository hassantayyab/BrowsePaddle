import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReadingListService } from '../../core/services';

@Component({
  selector: 'app-reading-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './reading-list.component.html',
})
export class ReadingListComponent {
  readonly readingListService = inject(ReadingListService);

  readonly showAddItem = signal(false);
  readonly activeTab = signal<'unread' | 'read'>('unread');

  newItemTitle = '';
  newItemUrl = '';
  newItemDescription = '';

  openAddItem(): void {
    this.showAddItem.set(true);
    this.newItemTitle = '';
    this.newItemUrl = '';
    this.newItemDescription = '';
  }

  closeAddItem(): void {
    this.showAddItem.set(false);
  }

  addItem(event: Event): void {
    event.preventDefault();
    if (this.newItemTitle.trim() && this.newItemUrl.trim()) {
      this.readingListService.addItem({
        title: this.newItemTitle.trim(),
        url: this.newItemUrl.trim(),
        description: this.newItemDescription.trim() || undefined,
      });
      this.closeAddItem();
    }
  }

  toggleRead(id: string): void {
    this.readingListService.toggleRead(id);
  }

  removeItem(id: string): void {
    this.readingListService.removeItem(id);
  }

  setActiveTab(tab: 'unread' | 'read'): void {
    this.activeTab.set(tab);
  }

  clearRead(): void {
    if (confirm('Are you sure you want to clear all read items?')) {
      this.readingListService.clearRead();
    }
  }
}
