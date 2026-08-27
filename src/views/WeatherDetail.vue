<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { fetchTomorrowForecast, fetchWeatherDetail } from '@/services/weatherApi'
import BaseDashBoardCard from '@/components/BaseDashBoardCard.vue'

const router = useRouter()
const cityData = ref(null)
const tomorrowData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const { displayTemp, unitSymbol } = useTemperature(() => cityData.value?.temp ?? 0)
const { displayTemp: tomorrowMaxTemp } = useTemperature(() => tomorrowData.value?.maxTemp ?? 0)
const { displayTemp: tomorrowMinTemp } = useTemperature(() => tomorrowData.value?.minTemp ?? 0)

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
    const [weather, tomorrow] = await Promise.all([
      fetchWeatherDetail(props.cityId),
      fetchTomorrowForecast(props.cityId),
    ])

    cityData.value = weather
    tomorrowData.value = tomorrow
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
  <section class="detail-page">
    <BaseDashBoardCard class="detail-card">
      <template #title>
        <h2>상세 날씨</h2>
      </template>

      <p v-if="isLoading" class="detail-message">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="errorMessage" class="detail-message error-message">{{ errorMessage }}</p>

      <div v-else-if="cityData" class="detail-content">
        <h3>{{ cityData.name }}</h3>

        <div class="detail-grid">
          <div class="detail-item">
            <span>기온</span>
            <strong>{{ displayTemp }}{{ unitSymbol }}</strong>
          </div>
          <div class="detail-item">
            <span>날씨</span>
            <strong>{{ cityData.status }}</strong>
          </div>
          <div class="detail-item">
            <span>습도</span>
            <strong>{{ cityData.humidity }}%</strong>
          </div>
          <div class="detail-item">
            <span>풍속</span>
            <strong>{{ cityData.wind }}m/s</strong>
          </div>
        </div>

        <div class="air-quality-block">
          <h4>대기질 정보</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span>AQI</span><strong>{{ cityData.airQuality }}</strong>
            </div>
            <div class="detail-item">
              <span>PM2.5</span><strong>{{ cityData.pm25 }} μg/m³</strong>
            </div>
            <div class="detail-item">
              <span>PM10</span><strong>{{ cityData.pm10 }} μg/m³</strong>
            </div>
          </div>
        </div>

        <div v-if="tomorrowData" class="air-quality-block">
          <h4>
            내일 날씨 <small>({{ tomorrowData.date }})</small>
          </h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span>날씨</span>
              <strong>{{ tomorrowData.status }}</strong>
            </div>
            <div class="detail-item">
              <span>최고 / 최저 기온</span>
              <strong>{{ tomorrowMaxTemp }} / {{ tomorrowMinTemp }}{{ unitSymbol }}</strong>
            </div>
            <div class="detail-item">
              <span>강수 확률</span>
              <strong>{{ tomorrowData.precipitationProbability }}%</strong>
            </div>
          </div>
        </div>
      </div>

      <el-button type="primary" @click="router.push({ name: 'WeatherHome' })">
        홈으로 돌아가기
      </el-button>
    </BaseDashBoardCard>
  </section>
</template>
