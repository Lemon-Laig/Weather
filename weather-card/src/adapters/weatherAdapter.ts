import type {
  CurrentWeatherRaw,
  CurrentWeatherView,
  DailyForecastView,
  DailyWeatherRaw,
} from '../types/weather'

const WIND_COMPASS_CN: Record<string, string> = {
  n: '北风',
  nne: '东北偏北风',
  ne: '东北风',
  ene: '东北偏东风',
  e: '东风',
  ese: '东南偏东风',
  se: '东南风',
  sse: '东南偏南风',
  s: '南风',
  ssw: '西南偏南风',
  sw: '西南风',
  wsw: '西南偏西风',
  w: '西风',
  wnw: '西北偏西风',
  nw: '西北风',
  nnw: '西北偏北风',
  vrb: '风向不定',
  none: '无风向',
}

function toRatio(value: number | undefined): number {
  if (!value) return 0
  return value <= 1 ? value : value / 100
}

export function toCurrentView(raw: CurrentWeatherRaw): CurrentWeatherView {
  return {
    text: raw.condition.text,
    iconCode: raw.condition.code,
    temp: Math.round(raw.temperature.value),
    feelsLike: Math.round(raw.feelsLike.value),
    humidityPercent: Math.round(toRatio(raw.humidity) * 100),
    windDirCn: WIND_COMPASS_CN[raw.wind.direction.compass] ?? raw.wind.direction.compass,
    windScale: raw.wind.scale,
    windSpeed: Number(raw.wind.speed.value.toFixed(1)),
    pressureHpa: Math.round(raw.pressure.value),
    visibilityKm: Math.round(raw.visibility.value / 1000),
  }
}

export function toDailyViews(raw: { days: DailyWeatherRaw[] }): DailyForecastView[] {
  return raw.days.map((day) => ({
    dateStr: day.forecastStartTime.slice(0, 10),
    dayText: day.daytime?.condition?.text ?? '--',
    nightText: day.nighttime?.condition?.text ?? '--',
    iconCode: day.daytime?.condition?.code ?? '999',
    tempMax: day.temperatureMax ? Math.round(day.temperatureMax.value) : 0,
    tempMin: day.temperatureMin ? Math.round(day.temperatureMin.value) : 0,
  }))
}
