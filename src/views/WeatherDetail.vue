<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { findWeatherById } from '@/data/weather'

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const cityData = computed(() => findWeatherById(props.cityId))
</script>

<template>
  <section>
    <h2>상세 날씨</h2>
    <div v-if="cityData">
      <h3>{{ cityData.name }}</h3>
      <p>기온: {{ cityData.temp }}℃</p>
      <p>날씨: {{ cityData.status }}</p>
    </div>
    <button @click="router.push('/')">홈으로 돌아가기</button>
  </section>
</template>
