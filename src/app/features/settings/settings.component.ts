import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SettingsService, WeatherService, NewsService } from '../../core/services';
import { SearchEngine, Theme } from '../../core/models';

type SectionKey =
  | 'showWeather'
  | 'showNews'
  | 'showQuickLinks'
  | 'showBookmarks'
  | 'showReadingList';

interface SectionConfig {
  key: SectionKey;
  label: string;
}

@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  readonly settingsService = inject(SettingsService);
  readonly weatherService = inject(WeatherService);
  readonly newsService = inject(NewsService);

  readonly showCitySearch = signal(false);
  citySearchQuery = '';

  readonly sections: SectionConfig[] = [
    { key: 'showQuickLinks', label: 'Quick Links' },
    { key: 'showWeather', label: 'Weather' },
    { key: 'showNews', label: 'News Feed' },
    { key: 'showReadingList', label: 'Reading List' },
  ];

  get userName(): string {
    return this.settingsService.userName();
  }

  set userName(value: string) {
    this.settingsService.setUserName(value);
  }

  setTheme(theme: Theme): void {
    this.settingsService.setTheme(theme);
  }

  setSearchEngine(engine: SearchEngine): void {
    this.settingsService.setSearchEngine(engine);
  }

  getSectionValue(key: SectionKey): boolean {
    return this.settingsService.settings()[key];
  }

  toggleSection(key: SectionKey): void {
    this.settingsService.toggleSection(key);
  }

  openCitySearch(): void {
    this.showCitySearch.set(true);
    this.citySearchQuery = '';
  }

  closeCitySearch(): void {
    this.showCitySearch.set(false);
  }

  searchCity(event: Event): void {
    event.preventDefault();
    if (this.citySearchQuery.trim()) {
      this.weatherService.searchCity(this.citySearchQuery.trim());
      this.closeCitySearch();
    }
  }

  clearWeatherLocation(): void {
    this.settingsService.setWeatherLocation(null);
    this.weatherService.refresh();
  }

  toggleNewsSource(sourceId: string): void {
    this.newsService.toggleSource(sourceId);
  }

  resetAllSettings(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.settingsService.resetSettings();
    }
  }
}
