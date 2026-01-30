export interface CurrentWeather {
  city: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  wind: number
  visibility: number
  pressure: number
  icon: string
  description: string
  sunrise: string
  sunset: string
}

export interface HourlyWeather {
  time: string
  temp: number
  icon: string
  description: string
}

export interface DailyWeather {
  date: string
  fullDate: string
  high: number
  low: number
  icon: string
  description: string
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyWeather[]
  daily: DailyWeather[]
}

export type TemperatureUnit = "metric" | "imperial"
