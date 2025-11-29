import { Injectable, signal, inject, effect } from '@angular/core';
import { StorageService, StorageKey } from './storage.service';
import { QuickLink, DEFAULT_QUICK_LINKS } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuickLinksService {
  private readonly storage = inject(StorageService);

  private readonly _quickLinks = signal<QuickLink[]>(this.loadQuickLinks());

  readonly quickLinks = this._quickLinks.asReadonly();

  constructor() {
    effect(() => {
      const links = this._quickLinks();
      this.storage.set(StorageKey.QuickLinks, links);
    });
  }

  private loadQuickLinks(): QuickLink[] {
    return this.storage.get<QuickLink[]>(StorageKey.QuickLinks, DEFAULT_QUICK_LINKS);
  }

  addLink(link: Omit<QuickLink, 'id' | 'order'>): void {
    const newLink: QuickLink = {
      ...link,
      id: crypto.randomUUID(),
      order: this._quickLinks().length,
    };
    this._quickLinks.update((links) => [...links, newLink]);
  }

  updateLink(id: string, updates: Partial<Omit<QuickLink, 'id'>>): void {
    this._quickLinks.update((links) =>
      links.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  }

  removeLink(id: string): void {
    this._quickLinks.update((links) => {
      const filtered = links.filter((link) => link.id !== id);
      return filtered.map((link, index) => ({ ...link, order: index }));
    });
  }

  reorderLinks(previousIndex: number, currentIndex: number): void {
    this._quickLinks.update((links) => {
      const reordered = [...links];
      const [moved] = reordered.splice(previousIndex, 1);
      reordered.splice(currentIndex, 0, moved);
      return reordered.map((link, index) => ({ ...link, order: index }));
    });
  }

  resetToDefaults(): void {
    this._quickLinks.set(DEFAULT_QUICK_LINKS);
  }

  getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  }
}
