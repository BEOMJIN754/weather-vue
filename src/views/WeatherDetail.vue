<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { fetchWeatherDetail } from '@/services/weatherApi'

const router = useRouter()
const cityData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const { displayTemp, unitSymbol } = useTemperature(() => cityData.value?.temp ?? 0)

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

async function loadWeatherDetail() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    cityData.value = await fetchWeatherDetail(props.cityId)
    if (!cityData.value) errorMessage.value = '등록되지 않은 도시입니다.'
  } catch (error) {
    console.error(error)
    errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.cityId, loadWeatherDetail, { immediate: true })
</script>

<template>
  <section>
    <h2>상세 날씨</h2>
    <p v-if="isLoading">is loading . . .</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="cityData">
      <h3>{{ cityData.name }}</h3>
      <p>기온: {{ displayTemp }}{{ unitSymbol }}</p>
      <p>날씨: {{ cityData.status }}</p>
      <p>습도: {{ cityData.humidity }}%</p>
      <p>풍속: {{ cityData.wind }}m/s</p>
      <hr />
      <h4>대기질 정보</h4>
      <p>AQI: {{ cityData.airQuality }}</p>
      <p>PM2.5: {{ cityData.pm25 }} μg/m³</p>
      <p>PM10: {{ cityData.pm10 }} μg/m³</p>
    </div>

    <button @click="router.push({ name: 'WeatherHome' })">홈으로 돌아가기</button>
  </section>
</template>
