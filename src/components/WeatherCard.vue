<script setup lang="ts">
import { ref } from 'vue'
import { useWeather } from '../composables/useWeather'

const {
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
} = useWeather()

const showDetail = ref(false)

const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function weekdayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return WEEK_CN[date.getDay()] ?? ''
}

function monthDay(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}/${Number(d)}`
}

function nowText(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>

<template>
  <div class="card-shell">
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        placeholder="输入城市名，如：北京"
        @input="onKeywordInput"
      />
      <ul v-if="keyword.trim().length > 0" class="city-dropdown">
        <li v-if="isSearching" class="dropdown-tip">搜索中…</li>
        <li v-else-if="searchError" class="dropdown-tip error">{{ searchError }}</li>
        <template v-else>
          <li
            v-for="(item, index) in cityOptions"
            :key="index"
            class="city-option"
            @mousedown.prevent="selectCity(item)"
          >
            <span>{{ item.name }}</span>
            <span class="option-sub">{{ item.province }}</span>
          </li>
        </template>
      </ul>
    </div>

    <div class="weather-card">
      <p v-if="isLoadingWeather" class="state-tip">☁️ 数据加载中…</p>

      <p v-else-if="loadError" class="state-tip">
        ⚠️ {{ loadError }}
        <button class="link-btn" @click="loadWeather">重试</button>
      </p>

      <template v-else-if="selectedCity && current">
        <div v-show="!showDetail" class="face">
          <p class="location">{{ selectedCity.name }}</p>
          <p class="option-sub">{{ selectedCity.province }} · 更新于 {{ nowText() }}</p>

          <div class="main-row">
            <i class="current-icon" :class="'qi-' + current.iconCode"></i>
            <div>
              <p class="temp">{{ current.temp }}°C</p>
              <p class="desc">{{ current.text }}</p>
            </div>
          </div>

          <dl class="info-grid">
            <div><dt>体感</dt><dd>{{ current.feelsLike }}°C</dd></div>
            <div><dt>湿度</dt><dd>{{ current.humidityPercent }}%</dd></div>
            <div><dt>风向</dt><dd>{{ current.windDirCn }}</dd></div>
            <div><dt>风力</dt><dd>{{ current.windScale }}级 · {{ current.windSpeed }}m/s</dd></div>
            <div><dt>气压</dt><dd>{{ current.pressureHpa }} hPa</dd></div>
            <div><dt>能见度</dt><dd>{{ current.visibilityKm }} km</dd></div>
          </dl>

          <button class="ghost-btn" @click="showDetail = true">查看未来 7 天 ▸</button>
        </div>

        <div v-show="showDetail" class="face">
          <div class="detail-head">
            <button class="link-btn" @click="showDetail = false">◂ 返回</button>
            <span>{{ selectedCity.name }} · 未来 7 天</span>
          </div>

          <p v-if="dailyList.length === 0" class="state-tip">暂无多日数据</p>
          <ul v-else class="daily-list">
            <li v-for="day in dailyList" :key="day.dateStr" class="daily-item">
              <div class="daily-date">
                <b>{{ monthDay(day.dateStr) }}</b>
                <span>{{ weekdayLabel(day.dateStr) }}</span>
              </div>
              <i class="daily-icon" :class="'qi-' + day.iconCode"></i>
              <div class="daily-desc">
                <span>昼 {{ day.dayText }}</span>
                <span>夜 {{ day.nightText }}</span>
              </div>
              <div class="daily-temp">
                <b>{{ day.tempMax }}°</b>
                <span>{{ day.tempMin }}°</span>
              </div>
            </li>
          </ul>
        </div>
      </template>

      <p v-else class="state-tip">输入城市名或等待默认城市加载…</p>
    </div>
  </div>
</template>

<style scoped>
.card-shell {
  width: 340px;
}

.search-box {
  position: relative;
  margin-bottom: 14px;
}

.search-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background: rgba(255, 255, 255, 0.92);
  color: #333;
}

.city-dropdown {
  position: absolute;
  z-index: 10;
  top: 42px;
  left: 0;
  right: 0;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  max-height: 220px;
  overflow-y: auto;
}

.city-option {
  padding: 9px 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border-radius: 6px;
}

.city-option:hover {
  background: #eef4ff;
}

.option-sub {
  font-size: 12px;
  color: #98a2b3;
}

.weather-card {
  padding: 22px;
  min-height: 320px;
  border-radius: 20px;
  color: #fff;
  background: linear-gradient(160deg, #5b8def 0%, #3a6fd8 55%, #2b56b8 100%);
  box-shadow: 0 16px 40px rgba(43, 86, 184, 0.45);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.state-tip {
  text-align: center;
  font-size: 14px;
  line-height: 2;
}

.link-btn {
  border: none;
  background: transparent;
  color: #ffd88a;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
}

.location {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.main-row {
  margin: 14px 0;
  display: flex;
  align-items: center;
  gap: 14px;
}

.current-icon {
  font-size: 72px;
}

.temp {
  margin: 0;
  font-size: 44px;
  font-weight: 700;
  line-height: 1.1;
}

.desc {
  margin: 2px 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 8px;
  margin: 10px 0 18px;
}

.info-grid dt {
  font-size: 12px;
  opacity: 0.75;
}

.info-grid dd {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 600;
}

.ghost-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.ghost-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 12px;
}

.daily-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.daily-item {
  display: grid;
  grid-template-columns: 64px 36px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 9px 4px;
  font-size: 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}

.daily-date {
  display: flex;
  flex-direction: column;
}

.daily-date span {
  font-size: 11px;
  opacity: 0.75;
}

.daily-icon {
  font-size: 28px;
}

.daily-desc {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  opacity: 0.85;
}

.daily-temp b {
  font-size: 15px;
}

.daily-temp span {
  margin-left: 6px;
  opacity: 0.7;
}
</style>
