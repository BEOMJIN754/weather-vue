export const cities = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'city_05', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'city_06', name: '오사카', lat: 34.6937, lon: 135.5023 },
]

export function findCityById(cityId) {
  return cities.find((city) => city.id === cityId)
}
