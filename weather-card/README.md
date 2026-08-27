
> 和风天气 Key 获取：前往[和风天气开发者控制台](https://console.qweather.com/) 创建项目并开通「Web API」服务。
> 本地运行会默认加载并查询「绍兴」的天气。

## 📡 使用的新版 API 端点

| 功能 | 端点 | 备注 |
|---|---|---|
| 城市搜索 | `GET /geo/v2/city/lookup?location={关键词}` | GeoAPI，返回城市坐标与行政区划 |
| 实时天气 | `GET /weather/v1/current/{lat}/{lon}` | 坐标需保留最多 2 位小数 |
| 多日预报 | `GET /weather/v1/daily/{lat}/{lon}?days=7&localTime=true` | 最长支持 10 天 |

## 📌 已知的数据坑位（适配层已处理）

1. GeoAPI 返回的 `lat/lon` 是**高精度字符串**，需四舍五入为两位小数再拼入路径参数
2. 新版实时天气中湿度取值为 `[0, 1]` 区间，需换算为百分比展示
3. 风向 `compass` 为英文缩写（如 `sw`），内置对照表翻译成中文方位词
4. 多日预报的时间戳默认为 UTC，开启 `localTime=true` 避免按自然日切分时错位

## 🔒 安全说明

- API 凭据仅存放在 `.env.local`（已被 `.gitignore` 的 `*.local` 规则排除）
- 参考模板见 `.env.example`；请勿将真实 Key 提交至公开仓库
- 目录 `weather-card\src\assets\node_modules` 为 从和风天气官网文档`qweather-icons`图标的安装目录
- 免费订阅有每日请求额度限制，请勿滥用

## 🙏 数据来源声明

天气数据由 [和风天气 QWeather](https://www.qweather.com/) 提供（依据其服务条款，页面中需包含数据归因信息）。
