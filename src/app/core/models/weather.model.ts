export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
  updatedAt: number;
}

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
}

// WMO Weather interpretation codes
export const WEATHER_CONDITIONS: Record<number, WeatherCondition> = {
  0: { code: 0, description: 'Clear sky', icon: '☀️' },
  1: { code: 1, description: 'Mainly clear', icon: '🌤️' },
  2: { code: 2, description: 'Partly cloudy', icon: '⛅' },
  3: { code: 3, description: 'Overcast', icon: '☁️' },
  45: { code: 45, description: 'Foggy', icon: '🌫️' },
  48: { code: 48, description: 'Depositing rime fog', icon: '🌫️' },
  51: { code: 51, description: 'Light drizzle', icon: '🌧️' },
  53: { code: 53, description: 'Moderate drizzle', icon: '🌧️' },
  55: { code: 55, description: 'Dense drizzle', icon: '🌧️' },
  61: { code: 61, description: 'Slight rain', icon: '🌧️' },
  63: { code: 63, description: 'Moderate rain', icon: '🌧️' },
  65: { code: 65, description: 'Heavy rain', icon: '🌧️' },
  66: { code: 66, description: 'Light freezing rain', icon: '🌨️' },
  67: { code: 67, description: 'Heavy freezing rain', icon: '🌨️' },
  71: { code: 71, description: 'Slight snow', icon: '❄️' },
  73: { code: 73, description: 'Moderate snow', icon: '❄️' },
  75: { code: 75, description: 'Heavy snow', icon: '❄️' },
  77: { code: 77, description: 'Snow grains', icon: '❄️' },
  80: { code: 80, description: 'Slight rain showers', icon: '🌦️' },
  81: { code: 81, description: 'Moderate rain showers', icon: '🌦️' },
  82: { code: 82, description: 'Violent rain showers', icon: '⛈️' },
  85: { code: 85, description: 'Slight snow showers', icon: '🌨️' },
  86: { code: 86, description: 'Heavy snow showers', icon: '🌨️' },
  95: { code: 95, description: 'Thunderstorm', icon: '⛈️' },
  96: { code: 96, description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

