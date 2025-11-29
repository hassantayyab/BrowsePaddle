export type Theme = 'dark' | 'light';
export type SearchEngine = 'google' | 'duckduckgo' | 'bing';

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface UserSettings {
  theme: Theme;
  searchEngine: SearchEngine;
  weatherLocation: WeatherLocation | null;
  showWeather: boolean;
  showNews: boolean;
  showQuickLinks: boolean;
  showBookmarks: boolean;
  showReadingList: boolean;
  userName: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  searchEngine: 'google',
  weatherLocation: null,
  showWeather: true,
  showNews: true,
  showQuickLinks: true,
  showBookmarks: true,
  showReadingList: true,
  userName: '',
};
