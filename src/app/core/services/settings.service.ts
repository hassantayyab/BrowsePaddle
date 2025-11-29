import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService, StorageKey } from './storage.service';
import { UserSettings, DEFAULT_SETTINGS, Theme, SearchEngine, WeatherLocation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state
  private readonly _settings = signal<UserSettings>(this.loadSettings());

  // Public readonly signals
  readonly settings = this._settings.asReadonly();
  readonly theme = computed(() => this._settings().theme);
  readonly searchEngine = computed(() => this._settings().searchEngine);
  readonly weatherLocation = computed(() => this._settings().weatherLocation);
  readonly userName = computed(() => this._settings().userName);

  // Visibility settings
  readonly showWeather = computed(() => this._settings().showWeather);
  readonly showNews = computed(() => this._settings().showNews);
  readonly showQuickLinks = computed(() => this._settings().showQuickLinks);
  readonly showBookmarks = computed(() => this._settings().showBookmarks);
  readonly showReadingList = computed(() => this._settings().showReadingList);

  constructor() {
    // Auto-save settings to storage when they change
    effect(() => {
      const settings = this._settings();
      this.storage.set(StorageKey.Settings, settings);
    });

    // Apply theme to document
    effect(() => {
      this.applyTheme(this._settings().theme);
    });
  }

  private loadSettings(): UserSettings {
    return this.storage.get<UserSettings>(StorageKey.Settings, DEFAULT_SETTINGS);
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
  }

  // Update methods
  setTheme(theme: Theme): void {
    this._settings.update((s) => ({ ...s, theme }));
  }

  toggleTheme(): void {
    this._settings.update((s) => ({
      ...s,
      theme: s.theme === 'dark' ? 'light' : 'dark',
    }));
  }

  setSearchEngine(searchEngine: SearchEngine): void {
    this._settings.update((s) => ({ ...s, searchEngine }));
  }

  setWeatherLocation(location: WeatherLocation | null): void {
    this._settings.update((s) => ({ ...s, weatherLocation: location }));
  }

  setUserName(userName: string): void {
    this._settings.update((s) => ({ ...s, userName }));
  }

  toggleSection(section: keyof Pick<UserSettings, 'showWeather' | 'showNews' | 'showQuickLinks' | 'showBookmarks' | 'showReadingList'>): void {
    this._settings.update((s) => ({ ...s, [section]: !s[section] }));
  }

  updateSettings(partial: Partial<UserSettings>): void {
    this._settings.update((s) => ({ ...s, ...partial }));
  }

  resetSettings(): void {
    this._settings.set(DEFAULT_SETTINGS);
  }
}



