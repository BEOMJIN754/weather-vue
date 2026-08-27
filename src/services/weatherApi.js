import axios from 'axios'
import { cities, findCityById } from '@/data/cities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 15000,
})

const airPollutionClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/air_pollution',
  timeout: 15000,
})

const forecastClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1/forecast',
  timeout: 15000,
})

const weatherCodeLabels = {
  0: '맑음',
  1: '대체로 맑음',
  2: '부분적으로 흐림',
  3: '흐림',
  45: '안개',
  48: '서리 안개',
  51: '약한 이슬비',
  53: '이슬비',
  55: '강한 이슬비',
  61: '약한 비',
  63: '비',
  65: '강한 비',
  71: '약한 눈',
  73: '눈',
  75: '강한 눈',
  80: '약한 소나기',
  81: '소나기',
  82: '강한 소나기',
  95: '뇌우',
  96: '우박을 동반한 뇌우',
  99: '강한 우박을 동반한 뇌우',
}

function assertApiKey() {
  if (!API_KEY) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.')
  }
}

async function requestWeather(city) {
  assertApiKey()

  const { data } = await weatherClient.get('', {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return data
}

async function requestAirPollution(city) {
  assertApiKey()

  const { data } = await airPollutionClient.get('', {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
    },
  })

  return data
}

function getAirQuality(aqi) {
  switch (aqi) {
    case 1:
      return '매우 좋음'
    case 2:
      return '좋음'
    case 3:
      return '보통'
    case 4:
      return '나쁨'
    case 5:
      return '매우 나쁨'
    default:
      return '정보 없음'
  }
}

function normalizeWeather(city, weatherdata, airData) {
  const air = airData.list?.[0]

  return {
    id: city.id,
    name: city.name,
    temp: weatherdata.main.temp,
    status: weatherdata.weather?.[0]?.main ?? '정보 없음',
    humidity: weatherdata.main.humidity,
    wind: weatherdata.wind.speed,

    aqi: air?.main?.aqi ?? '정보 없음',
    airQuality: getAirQuality(air?.main.aqi),
    pm25: air?.components?.pm2_5 ?? '정보 없음',
    pm10: air?.components?.pm10 ?? '정보 없음',
  }
}

export async function fetchWeatherList() {
  return Promise.all(
    cities.map(async (city) => {
      const [weatherData, airData] = await Promise.all([
        requestWeather(city),
        requestAirPollution(city),
      ])

      return normalizeWeather(city, weatherData, airData)
    }),
  )
}

export async function fetchWeatherDetail(cityId) {
  const city = findCityById(cityId)

  if (!city) return null

  const [weatherData, airData] = await Promise.all([
    requestWeather(city),
    requestAirPollution(city),
  ])

  return normalizeWeather(city, weatherData, airData)
}

export async function fetchTomorrowForecast(cityId) {
  const city = findCityById(cityId)
  if (!city) return null

  const { data } = await forecastClient.get('', {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: 2,
      timezone: 'auto',
    },
  })

  const tomorrowIndex = 1
  const weatherCode = data.daily?.weather_code?.[tomorrowIndex]

  return {
    date: data.daily?.time?.[tomorrowIndex],
    status: weatherCodeLabels[weatherCode] ?? '정보 없음',
    maxTemp: data.daily?.temperature_2m_max?.[tomorrowIndex],
    minTemp: data.daily?.temperature_2m_min?.[tomorrowIndex],
    precipitationProbability: data.daily?.precipitation_probability_max?.[tomorrowIndex],
  }
}
