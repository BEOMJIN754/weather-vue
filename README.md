# Vue Weather Dashboard

## 프로젝트 개요

본 프로젝트는 Vue 3 기반의 날씨 정보 조회 SPA(Single Page Application)이다.  
사용자는 도시를 검색하고 해당 도시의 날씨와 온도 정보를 확인할 수 있다.

## Vue Router

Vue Router를 사용하여 페이지 전체를 새로 불러오지 않고 Home, About, 날씨 상세, 404 화면을 전환.
`App.vue`의 `RouterView`가 현재 URL에 해당하는 View를 렌더링하며, `RouterLink`는 Home과 About 화면 이동에 사용한다.

| 경로               | 라우트 이름     | 화면             |
| ------------------ | --------------- | ---------------- |
| `/`                | `WeatherHome`   | 날씨 대시보드    |
| `/about`           | `WeatherAbout`  | 서비스 소개      |
| `/weather/:cityId` | `WeatherDetail` | 도시별 상세 날씨 |
| `/not-found`       | `NotFound`      | 404 화면         |

네비게이션 가드 사용해서 상세 페이지 진입 전에 `FindCityById` 로 등록된 도시인지 검사. -> 없다면 404NotFound로 이동

검색어는 `?search=` 쿼리와 연결되어 새로고침하거나 브라우저의 뒤로 가기를 사용해도 검색 상태가 URL에 반영된다.

## Pinia - 전역 온도 단위 관리

`configStore.js`는 애플리케이션 전체에서 공유하는 온도 단위를 `celsius` 또는 `fahrenheit`로 보관한다.

원래 store 사용 전에 추가 기능으로 온도 관리를 만들어두었는데, Pinia 실습에서 진행하게 되어 기존 코드가 사라지게 되었다.

```js
function toggleUnit() {
  unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
}
```

`UnitToggler.vue`는 store의 `toggleUnit()`을 호출한다. `WeatherCard.vue`와 `WeatherDetail.vue`는 직접 변환 로직을 작성하지 않고 `useTemperature()` Composable을 사용한다.

```js
export function useTemperature(celsiusSource) {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const celsius = Number(toValue(celsiusSource))
    return configStore.unit === 'fahrenheit'
      ? Math.round((celsius * 9) / 5 + 32)
      : Math.round(celsius)
  })

  return { displayTemp, unitSymbol }
}
```

단위를 한 번 변경하면 목록의 현재 기온, 상세 기온, 내일 최고·최저 기온이 동시에 갱신된다.

## OpenWeather REST API

`weatherApi.js`는 화면 컴포넌트와 외부 API 사이의 통신을 담당한다.
초기 타임아웃이 7초였으나 후에 대기오염 API 데이터까지 받아오게 되며 타임아웃으로 못받아오는 경우가 생겨서 15초로 변경하게 되었다.

```js
const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 15000,
})
```

제외하고도 같은 openweathermap 에서 air_pollution API 를 사용한다.

weatherCodeLabels을 openweathermap의 날씨 표기에도 매핑하고 싶었는데, 키 밸루가 다른지라 weatherdata 의 status 내용을 바꾸지 못해... 그냥 기존의 main값으로 사용하게 되었다. (매핑해서 더 보기좋게 나타내고 싶었다.)

- `normalizeWeather(city, weatherData, airData)`: 서로 다른 API 응답을 화면용 객체로 변환 (weather,airpollution)

## Element Plus

`el-button`활용 위치

- 즐겨찾기 추가 및 해제
- 상세 페이지 이동
- 온도 단위 변경
- API 조회 다시 시도
- 상세 페이지에서 Home으로 이동

확실히 기존의 좁쌀같은 버튼보다, 만들어진 친구를 사용하는게 보기 좋았다.

## Vite Build

예민할 수 있는 API 키는 깃에도 들어가지 않고(`.env`는 `.gitignore`에 등록) 버셀에도 들어가지 않는다.

버셀의 environments에 따로 등록해두었다.

```js
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
```

### 로컬 실행 검증

배포 전 최종 검증 항목은 다음과 같다.

1. Home에서 6개 도시의 현재 날씨와 대기질이 표시되는지 확인
2. 검색어가 목록과 URL query에 함께 반영되는지 확인
3. 즐겨찾기 추가와 해제가 정상 동작하는지 확인
4. 전역 단위 버튼으로 모든 온도가 섭씨와 화씨로 전환되는지 확인
5. Details 버튼으로 올바른 도시 상세 경로에 이동하는지 확인
6. 상세 화면에서 현재 날씨, 대기질, 내일 예보가 표시되는지 확인
7. 잘못된 도시 ID와 존재하지 않는 URL이 404 화면으로 이동하는지 확인
8. `npm run lint`와 `npm run build`가 성공하는지 확인

### Vercel 배포

Vue Router의 `createWebHistory()`를 사용하므로 Vercel에서 상세 URL 새로고침 시 404가 발생한다면 모든 경로를 `/index.html`로 보내는 rewrite 설정이 필요하다.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

위 설정은 프로젝트 루트의 `vercel.json`에 작성되어 있다.

## 추가 기능

### 1. 즐겨찾기 추가 및 해제

`WeatherDashboard.vue`의 `favoriteCityNames`가 즐겨찾기한 도시 이름을 저장한다. `WeatherCard.vue`는 현재 도시가 즐겨찾기 상태인지 `isFavorite` prop으로 받고, 버튼 클릭 시 `toggle-favorite` 이벤트를 부모에게 전달한다.

주요 함수는 `toggleFavorite(cityName)`이다.

```js
function toggleFavorite(cityName) {
  if (favoriteCityNames.value.includes(cityName)) {
    favoriteCityNames.value = favoriteCityNames.value.filter((name) => name !== cityName)
    return
  }

  favoriteCityNames.value.push(cityName)
}
```

이미 포함된 도시는 `filter()`로 제거하고, 포함되지 않은 도시는 `push()`로 추가한다. 이벤트 처리에는 `.stop`을 적용하여 즐겨찾기 버튼 클릭이 카드 선택 이벤트로 전파되지 않게 했다. 현재 즐겨찾기는 메모리 상태이므로 새로고침하면 초기화된다.

### 2. 대기오염 정보 조회 및 표시

OpenWeather Air Pollution API를 이용하여 도시별 AQI, PM2.5, PM10을 조회한다.

- `requestAirPollution(city)`: 위도와 경도로 대기오염 정보를 요청한다.
- `getAirQuality(aqi)`: 숫자 AQI 1~5를 `매우 좋음`부터 `매우 나쁨`까지의 문구로 변환한다.
- `normalizeWeather()`: 현재 날씨와 대기오염 데이터를 하나의 객체로 합친다.

`fetchWeatherDetail()`은 `Promise.all()`을 사용해 현재 날씨와 대기오염 요청을 동시에 실행한다.

```js
const [weatherData, airData] = await Promise.all([requestWeather(city), requestAirPollution(city)])
```

병렬 요청을 사용해 두 요청을 순차적으로 기다리는 것보다 상세 데이터를 빠르게 구성한다.

### 3. Open-Meteo API를 이용한 내일 날씨

Open-Meteo Forecast API를 추가하여 선택한 도시의 내일 예보를 상세 화면에 표시한다. 이 API는 별도 키 없이 `cities.js`의 위도와 경도를 사용한다.

주요 함수는 `fetchTomorrowForecast(cityId)`이다.

```js
const { data } = await forecastClient.get('', {
  params: {
    latitude: city.lat,
    longitude: city.lon,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: 2,
    timezone: 'auto',
  },
})
```

Open-Meteo의 `daily` 응답은 날짜별 배열이므로 인덱스 `1`을 사용하여 내일 값을 선택한다. `weatherCodeLabels`는 숫자로 제공되는 WMO 날씨 코드를 한국어 문구로 변환한다.

```js
const tomorrowIndex = 1
const weatherCode = data.daily?.weather_code?.[tomorrowIndex]
```

## 도움 받은 부분

1. 전체적인 구조와 기능별 구현을 기존 실습 자료를 바탕으로 클론코딩 -> 지우고 혼자 타이핑의 순서로 진행하였다.
2. 디자인적인 부분은 미감이 떨어져 GPT 활용을 진행하였다.
3. MD 파일 정리는 우선적으로 노션에 작성 -> README 파일 변환 요청으로 변경된 내용을 첨삭하고 사용하는 형식으로 진행하였다.
4. 뷰 너무 어렵습니다. . .
