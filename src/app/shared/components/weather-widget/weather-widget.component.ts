import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../../core/services';

@Component({
  selector: 'app-weather-widget',
  imports: [],
  template: `
    <div class="h-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-surface-400 uppercase tracking-wider">Weather</h2>
        <button
          (click)="refresh()"
          class="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
          [class.animate-spin]="weatherService.loading()"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      @if (weatherService.loading() && !weatherService.weather()) {
        <div class="flex items-center justify-center h-24">
          <div class="w-6 h-6 border-2 border-surface-600 border-t-accent-500 rounded-full animate-spin"></div>
        </div>
      } @else if (weatherService.error() && !weatherService.weather()) {
        <div class="text-center py-4">
          <p class="text-surface-500 text-sm mb-3">{{ weatherService.error() }}</p>
          <button
            (click)="weatherService.requestGeolocation()"
            class="text-xs text-accent-400 hover:text-accent-300"
          >
            Enable location
          </button>
        </div>
      } @else if (weatherService.weather(); as weather) {
        <div class="flex items-start gap-4">
          <!-- Weather icon & temp -->
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ getWeatherIcon(weather.weatherCode, weather.isDay) }}</span>
            <div>
              <p class="text-3xl font-light text-surface-100">{{ weather.temperature }}°</p>
              <p class="text-sm text-surface-500">Feels like {{ weather.apparentTemperature }}°</p>
            </div>
          </div>

          <!-- Details -->
          <div class="ml-auto text-right">
            <p class="text-surface-300 text-sm">{{ getWeatherDescription(weather.weatherCode) }}</p>
            <p class="text-surface-500 text-xs mt-1">{{ weather.location }}</p>
            <div class="flex items-center gap-3 mt-2 text-xs text-surface-500">
              <span title="Humidity">💧 {{ weather.humidity }}%</span>
              <span title="Wind">💨 {{ weather.windSpeed }} km/h</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-4">
          <p class="text-surface-500 text-sm mb-3">Click to get weather</p>
          <button
            (click)="weatherService.fetchWeather()"
            class="px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-sm text-surface-300 transition-colors"
          >
            Get Weather
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class WeatherWidgetComponent implements OnInit {
  readonly weatherService = inject(WeatherService);

  ngOnInit(): void {
    if (!this.weatherService.weather()) {
      this.weatherService.fetchWeather();
    }
  }

  refresh(): void {
    this.weatherService.refresh();
  }

  getWeatherIcon(code: number, isDay: boolean): string {
    const condition = this.weatherService.getWeatherCondition(code);
    
    // Adjust icons for night time
    if (!isDay) {
      if (code === 0) return '🌙';
      if (code === 1) return '🌙';
      if (code === 2) return '☁️';
    }
    
    return condition.icon;
  }

  getWeatherDescription(code: number): string {
    return this.weatherService.getWeatherCondition(code).description;
  }
}



