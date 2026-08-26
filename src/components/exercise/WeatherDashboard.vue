<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: 'seoul', temp: 24, status: '맑음' },
  { id: 'city_02', name: 'soowon', temp: 29, status: '비' },
  { id: 'city_03', name: 'busan', temp: 30, status: '구름' },
  { id: 'city_04', name: 'incheon', temp: 23, status: '흐림' },
  { id: 'city_05', name: 'ulsan', temp: 33, status: '폭염' },
  { id: 'city_06', name: 'osaka', temp: 22, status: '맑음' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보시오')

function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log('[watch] selected: ', newInfo)
})

watchEffect(() => {
  console.log('[watchEffect] 검색어: ', searchQuery.value)
})

//추가1 : 온도 단위 변환
const temperatureUnit = ref('C')

function changeTemperatureUnit() {
  if (temperatureUnit.value === 'C') {
    temperatureUnit.value = 'F'
  } else {
    temperatureUnit.value = 'C'
  }
}

function displayTemperature(celsius) {
  if (temperatureUnit.value === 'C') {
    return celsius
  }

  return ((celsius * 9) / 5 + 32).toFixed(1)
}

//추가2 : 즐겨찾기 기능
const favoriteCityNames = ref([])

function toggleFavorite(cityName) {
  if (favoriteCityNames.value.includes(cityName)) {
    favoriteCityNames.value = favoriteCityNames.value.filter((name) => name !== cityName)
  } else {
    favoriteCityNames.value.push(cityName)
  }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h2>도시 검색</h2>
      <input
        type="text"
        :value="searchQuery"
        placeholder="enter the city"
        @input="searchQuery = $event.target.value"
      />
      <p>
        searching city: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="favorite-box">
      <h2>⭐ Favorite Cities</h2>
      <p v-if="favoriteCityNames.length === 0">아직 즐겨찾기한 도시가 없습니다.</p>
      <p v-else>{{ favoriteCityNames.join(', ') }}</p>
    </section>

    <section class="list-box">
      <h2>weather by city</h2>
      <article
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <button @click.stop="toggleFavorite(item.name)">
          {{ favoriteCityNames.includes(item.name) ? '★ delete Favorite' : '☆ Favorite' }}
        </button>
        <h3>{{ item.name }}({{ item.status }})</h3>
        <button @click="changeTemperatureUnit">온도 단위 변경</button>
        <p>temperature now: {{ displayTemperature(item.temp) }}°</p>

        <span v-if="item.temp >= 25" class="temperature-status hot">🥵 더움</span>
        <span v-else-if="item.temp <= 10" class="temperature-status cold">🥶 추움</span>
        <span v-else class="temperature-status cool">🍃 시원함</span>

        <button class="detail-button" @click.stop="showDetail(item.name, item.status)">
          Details
        </button>
      </article>
    </section>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
