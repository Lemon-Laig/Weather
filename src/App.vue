<script setup lang="ts">
import WeatherCard from './components/WeatherCard.vue'
</script>

<template>
  <div class="page">
    <h1 class="title">☁️ 天气卡片</h1>
    <WeatherCard />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.title {
  color: #fff;
  font-size: 22px;
  margin-bottom: 20px;
  letter-spacing: 2px;
}
</style>
