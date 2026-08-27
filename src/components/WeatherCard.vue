<script setup>
import { toRef } from 'vue'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'toggle-favorite', 'show-detail'])
const { displayTemp, unitSymbol } = useTemperature(toRef(() => props.weather.temp))
</script>

<template>
  <article class="weather-card" @click="emit('select', props.weather.name)">
    <button type="button" @click.stop="emit('toggle-favorite', props.weather.name)">
      {{ props.isFavorite ? '★ delete Favorite' : '☆ Favorite' }}
    </button>

    <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>

    <p>Temp.now: {{ displayTemp }}{{ unitSymbol }}</p>
    <p>Weather: {{ props.weather.status }}</p>

    <p>대기질: {{ props.weather.airQuality }}</p>
    <p>PM2.5: {{ props.weather.pm25 }} μg/m³</p>
    <p>PM10: {{ props.weather.pm10 }} μg/m³</p>

    <span v-if="props.weather.temp >= 25" class="temperature-status hot"> 🥵 더움 </span>
    <span v-else-if="props.weather.temp <= 10" class="temperature-status cold"> 🥶 추움 </span>
    <span v-else class="temperature-status cool">🍃 시원함</span>

    <button type="button" class="detail-button" @click.stop="emit('show-detail', props.weather.id)">
      details
    </button>
  </article>
</template>
