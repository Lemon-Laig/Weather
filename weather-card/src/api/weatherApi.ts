import type {
  CityInfo,
  CurrentWeatherRaw,
  DailyWeatherRaw,
  GeoLocation,
} from '../types/weather'

const HOST = String(import.meta.env.VITE_QWEATHER_HOST ?? '')
const KEY = String(import.meta.env.VITE_QWEATHER_KEY ?? '')

async function request<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`请求失败（${res.status}）`)
  }
  return res.json() as Promise<T>
}

export async function searchCity(keyword: string): Promise<CityInfo[]> {
  const path = `${HOST}/geo/v2/city/lookup?location=${encodeURIComponent(keyword)}&key=${KEY}`
  const data = await request<{ location?: GeoLocation[] }>(path)
  if (!data.location?.length) {
    throw new Error('未找到相关城市')
  }
  return data.location.map((item) => ({
    name: item.name,
    province: `${item.adm1} ${item.adm2}`,
    lat: Number(Number(item.lat).toFixed(2)),
    lon: Number(Number(item.lon).toFixed(2)),
  }))
}

export function fetchCurrentWeather(city: CityInfo): Promise<CurrentWeatherRaw> {
  return request(
    `${HOST}/weather/v1/current/${city.lat}/${city.lon}?lang=zh&key=${KEY}`,
  )
}

export function fetchDailyWeather(city: CityInfo): Promise<{ days: DailyWeatherRaw[] }> {
  return request(
    `${HOST}/weather/v1/daily/${city.lat}/${city.lon}?days=7&lang=zh&localTime=true&key=${KEY}`,
  )
}
