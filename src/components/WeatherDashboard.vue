<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWeatherList } from '@/services/weatherApi.js'
import BaseDashBoardCard from './BaseDashBoardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const route = useRoute()
const router = useRouter()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 주세요.')
const searchQuery = ref(typeof route.query.search === 'string' ? route.query.search : '')
const favoriteCityNames = ref([])

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return weatherList.value

  return weatherList.value.filter((city) => city.name.toLowerCase().includes(query))
})

watch(searchQuery, (search) => {
  router.replace({
    query: { ...route.query, search: search.trim() || undefined },
  })
})

watch(
  () => route.query.search,
  (search) => {
    const nextSearch = typeof search === 'string' ? search : ''
    if (nextSearch !== searchQuery.value) searchQuery.value = nextSearch
  },
)

async function loadWeather() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    weatherList.value = await fetchWeatherList()
  } catch (error) {
    console.error(error)
    errorMessage.value = '날씨 정보를 불러오지 못했습니다. API 키와 네트워크를 확인하세요.'
  } finally {
    isLoading.value = false
  }
}

function goDetail(cityId) {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

function toggleFavorite(cityName) {
  if (favoriteCityNames.value.includes(cityName)) {
    favoriteCityNames.value = favoriteCityNames.value.filter((name) => name !== cityName)
    return
  }

  favoriteCityNames.value.push(cityName)
}

onMounted(loadWeather)
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashBoardCard class="search-box">
      <template #title><h2>도시 검색</h2></template>
      <SearchBar :current-query="searchQuery" @update-query="searchQuery = $event" />
      <p>
        검색어: <strong>{{ searchQuery }}</strong>
      </p>
    </BaseDashBoardCard>

    <BaseDashBoardCard class="favorite-box">
      <template #title><h2>⭐ 즐겨찾는 도시</h2></template>
      <p v-if="favoriteCityNames.length === 0">아직 즐겨찾기한 도시가 없습니다.</p>
      <p v-else>{{ favoriteCityNames.join(', ') }}</p>
    </BaseDashBoardCard>

    <BaseDashBoardCard class="list-box">
      <template #title><h2>도시별 날씨</h2></template>

      <p v-if="isLoading">날씨 정보를 불러오는 중입니다...</p>

      <div v-else-if="errorMessage">
        <p class="error-message">{{ errorMessage }}</p>
        <el-button type="primary" @click="loadWeather"> 다시 시도 </el-button>
      </div>

      <template v-else>
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :weather="city"
          :is-favorite="favoriteCityNames.includes(city.name)"
          @select="selectedCityInfo = `${$event}이 선택되었습니다.`"
          @toggle-favorite="toggleFavorite"
          @show-detail="goDetail"
        />

        <p v-if="filteredWeatherList.length === 0">검색 결과가 없습니다.</p>
      </template>
    </BaseDashBoardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
