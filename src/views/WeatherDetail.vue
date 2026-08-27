<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { findWeatherById } from '@/data/weather'

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const weather = computed(() => findWeatherById(props.cityId))
</script>

<template>
  <section v-if="weather" class="weather-detail">
    <h2>{{ weather.name }} 상세 날씨</h2>
    <dl>
      <dt>현재 온도</dt>
      <dd>{{ weather.temp }}°C</dd>
      <dt>날씨 상태</dt>
      <dd>{{ weather.status }}</dd>
    </dl>
    <RouterLink :to="{ name: 'WeatherHome' }">목록으로 돌아가기</RouterLink>
  </section>
</template>
