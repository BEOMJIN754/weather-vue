import axios from 'axios'
import { cities, findCityById } from '@/data/cities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 7000,
})

const airPollutionClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/air_pollution',
  timeout: 7000,
})

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
