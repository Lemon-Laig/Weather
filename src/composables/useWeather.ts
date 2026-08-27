import { onMounted, ref } from 'vue'
import {
  fetchCurrentWeather,
  fetchDailyWeather,
  searchCity,
} from '../api/weatherApi'
import { toCurrentView, toDailyViews } from '../adapters/weatherAdapter'
import type {
  CityInfo,
  CurrentWeatherView,
  DailyForecastView,
} from '../types/weather'

const DEFAULT_CITY_KEYWORD = '北京'

export function useWeather() {
  const keyword = ref('')
  const cityOptions = ref<CityInfo[]>([])
  const selectedCity = ref<CityInfo | null>(null)
  const current = ref<CurrentWeatherView | null>(null)
  const dailyList = ref<DailyForecastView[]>([])
  const isSearching = ref(false)
  const isLoadingWeather = ref(false)
  const searchError = ref('')
  const loadError = ref('')

  async function runSearch() {
    const word = keyword.value.trim()
    if (!word) {
      cityOptions.value = []
      searchError.value = ''
      return
    }
    isSearching.value = true
    searchError.value = ''
    try {
      cityOptions.value = await searchCity(word)
      if (!cityOptions.value.length) {
        searchError.value = '未找到相关城市'
      }
    } catch (error) {
      cityOptions.value = []
      searchError.value =
        error instanceof Error ? error.message : '搜索失败，请稍后重试'
    } finally {
      isSearching.value = false
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  function onKeywordInput() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(runSearch, 300)
  }

  async function selectCity(city: CityInfo) {
    keyword.value = ''
    cityOptions.value = []
    selectedCity.value = city
    await loadWeather()
  }

  async function loadWeather() {
    const city = selectedCity.value
    if (!city) return
    isLoadingWeather.value = true
    loadError.value = ''
    current.value = null
    dailyList.value = []
    try {
      const [currentRaw, dailyRaw] = await Promise.all([
        fetchCurrentWeather(city),
        fetchDailyWeather(city),
      ])
      current.value = toCurrentView(currentRaw)
      dailyList.value = toDailyViews(dailyRaw)
    } catch (error) {
      loadError.value =
        error instanceof Error ? error.message : '天气加载失败，请检查网络'
    } finally {
      isLoadingWeather.value = false
    }
  }

  onMounted(async () => {
    try {
      const list = await searchCity(DEFAULT_CITY_KEYWORD)
      if (list[0]) await selectCity(list[0])
    } catch {
      selectedCity.value = null
    }
  })

  return {
    keyword,
    cityOptions,
    selectedCity,
    current,
    dailyList,
    isSearching,
    isLoadingWeather,
    searchError,
    loadError,
    onKeywordInput,
    selectCity,
    loadWeather,
  }
}
