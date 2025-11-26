import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService, StorageKey } from './storage.service';
import { SettingsService } from './settings.service';
import { WeatherData, WEATHER_CONDITIONS, WeatherLocation } from '../models';
import { catchError, of, tap } from 'rxjs';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    is_day: number;
  };
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly settings = inject(SettingsService);

  private readonly _weather = signal<WeatherData | null>(this.loadCachedWeather());
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly weather = this._weather.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private loadCachedWeather(): WeatherData | null {
    const cached = this.storage.get<WeatherData | null>(StorageKey.WeatherCache, null);
    if (cached && Date.now() - cached.updatedAt < CACHE_DURATION) {
      return cached;
    }
    return null;
  }

  fetchWeather(): void {
    const location = this.settings.weatherLocation();

    if (!location) {
      this.requestGeolocation();
      return;
    }

    this.fetchWeatherForLocation(location);
  }

  requestGeolocation(): void {
    if (!navigator.geolocation) {
      this._error.set('Geolocation is not supported by your browser');
      return;
    }

    this._loading.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: WeatherLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Reverse geocode to get city name
        this.reverseGeocode(location);
      },
      (error) => {
        this._loading.set(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this._error.set('Location access denied. Please enable location or set a city in settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            this._error.set('Location unavailable');
            break;
          case error.TIMEOUT:
            this._error.set('Location request timed out');
            break;
          default:
            this._error.set('An unknown error occurred');
        }
      }
    );
  }

  searchCity(query: string): void {
    if (!query.trim()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<GeocodingResponse>(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`)
      .pipe(
        catchError((err) => {
          this._error.set('Failed to search for city');
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response?.results?.length) {
          const result = response.results[0];
          const location: WeatherLocation = {
            latitude: result.latitude,
            longitude: result.longitude,
            city: result.name,
            country: result.country,
          };

          this.settings.setWeatherLocation(location);
          this.fetchWeatherForLocation(location);
        } else {
          this._error.set('City not found');
          this._loading.set(false);
        }
      });
  }

  private reverseGeocode(location: WeatherLocation): void {
    this.http
      .get<GeocodingResponse>(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}&count=1`
      )
      .pipe(
        catchError(() => of(null))
      )
      .subscribe((response) => {
        if (response?.results?.length) {
          location.city = response.results[0].name;
          location.country = response.results[0].country;
        }

        this.settings.setWeatherLocation(location);
        this.fetchWeatherForLocation(location);
      });
  }

  private fetchWeatherForLocation(location: WeatherLocation): void {
    this._loading.set(true);
    this._error.set(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,is_day`;

    this.http
      .get<OpenMeteoResponse>(url)
      .pipe(
        tap((response) => {
          const weatherData: WeatherData = {
            temperature: Math.round(response.current.temperature_2m),
            apparentTemperature: Math.round(response.current.apparent_temperature),
            weatherCode: response.current.weather_code,
            humidity: response.current.relative_humidity_2m,
            windSpeed: Math.round(response.current.wind_speed_10m),
            isDay: response.current.is_day === 1,
            location: location.city || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
            updatedAt: Date.now(),
          };

          this._weather.set(weatherData);
          this.storage.set(StorageKey.WeatherCache, weatherData);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set('Failed to fetch weather data');
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  getWeatherCondition(code: number) {
    return WEATHER_CONDITIONS[code] || WEATHER_CONDITIONS[0];
  }

  refresh(): void {
    this.storage.remove(StorageKey.WeatherCache);
    this._weather.set(null);
    this.fetchWeather();
  }
}

