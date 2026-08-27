<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { weatherList } from '@/data/weather'

import BaseDashBoardCard from './BaseDashBoardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보시오')
const router = useRouter()

function goDetail(cityId) {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList

  return weatherList.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
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
    <BaseDashBoardCard class="search-box">
      <template #title><h2>도시 검색</h2></template>
      <SearchBar :current-query="searchQuery" @update-query="searchQuery = $event" />
      <p>
        searching city: <strong>{{ searchQuery }}</strong>
      </p>
    </BaseDashBoardCard>

    <BaseDashBoardCard class="favorite-box">
      <template #title><h2>⭐ Favorite Cities</h2></template>
      <p v-if="favoriteCityNames.length === 0">아직 즐겨찾기한 도시가 없습니다.</p>
      <p v-else>{{ favoriteCityNames.join(', ') }}</p>
    </BaseDashBoardCard>

    <BaseDashBoardCard class="list-box">
      <template #title><h2>weather by city</h2></template>
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :weather="item"
        :temperature-unit="temperatureUnit"
        :is-favorite="favoriteCityNames.includes(item.name)"
        @select="selectedCityInfo = `${$event}이 선택되었습니다.`"
        @toggle-favorite="toggleFavorite"
        @change-temperature-unit="changeTemperatureUnit"
        @show-detail="goDetail"
      />
      <p v-if="filteredWeatherList.length === 0">검색 결과가 없습니다.</p>
    </BaseDashBoardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
