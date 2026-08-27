export const weatherList = [
  { id: 'city_01', name: 'seoul', temp: 24, status: '맑음' },
  { id: 'city_02', name: 'soowon', temp: 29, status: '비' },
  { id: 'city_03', name: 'busan', temp: 30, status: '구름' },
  { id: 'city_04', name: 'incheon', temp: 23, status: '흐림' },
  { id: 'city_05', name: 'ulsan', temp: 33, status: '폭염' },
  { id: 'city_06', name: 'osaka', temp: 22, status: '맑음' },
]

export function findWeatherById(cityId) {
  return weatherList.find((weather) => weather.id === cityId)
}
