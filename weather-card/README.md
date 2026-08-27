# Vue 3 + TypeScript + Vite
weather-card/
├── src/
│   ├── api/
│   │   └── weatherApi.ts          # 和风天气API请求封装
│   ├── adapters/
│   │   └── weatherAdapter.ts     # 数据适配器（字段映射）
│   ├── composables/
│   │   └── useWeather.ts          # 天气业务逻辑Hook
│   ├── components/
│   │   └── WeatherCard.vue        # 天气卡片组件
│   ├── types/
│   │   └── weather.ts             # TypeScript类型定义
│   ├── App.vue
│   └── main.ts
├── .env.local                     # API Key配置（不提交仓库）
├── .env.example                   # 环境变量示例
├── vite.config.ts                 # Vite代理配置
└── index.html
