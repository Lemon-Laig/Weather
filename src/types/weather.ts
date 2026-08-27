export interface GeoLocation {
  name: string
  lat: string
  lon: string
  adm1: string
  adm2: string
}

export interface CityInfo {
  name: string
  province: string
  lat: number
  lon: number
}

export interface ConditionRaw {
  text: string
  code: string
}

export interface CurrentWeatherRaw {
  condition: ConditionRaw
  temperature: { value: number }
  feelsLike: { value: number }
  humidity: number
  wind: {
    direction: { degree: number; compass: string }
    speed: { value: number }
    scale: number
  }
  pressure: { value: number }
  visibility: { value: number }
}

export interface DailyWeatherRaw {
  forecastStartTime: string
  temperatureMax?: { value: number }
  temperatureMin?: { value: number }
  daytime?: { condition?: ConditionRaw }
  nighttime?: { condition?: ConditionRaw }
}

export interface CurrentWeatherView {
  text: string
  iconCode: string
  temp: number
  feelsLike: number
  humidityPercent: number
  windDirCn: string
  windScale: number
  windSpeed: number
  pressureHpa: number
  visibilityKm: number
}

export interface DailyForecastView {
  dateStr: string
  dayText: string
  nightText: string
  iconCode: string
  tempMax: number
  tempMin: number
}
