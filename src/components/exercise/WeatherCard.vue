<script setup>
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  temperatureUnit: {
    type: String,
    default: 'C',
    validator: (value) => ['C', 'F'].includes(value),
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'toggle-favorite', 'change-temperature-unit', 'show-detail'])

function displayTemperature(celsius) {
  if (props.temperatureUnit === 'C') return celsius

  return ((celsius * 9) / 5 + 32).toFixed(1)
}
</script>

<template>
  <article class="weather-card" @click="emit('select', props.weather.name)">
    <button type="button" @click.stop="emit('toggle-favorite', props.weather.name)">
      {{ props.isFavorite ? '★ delete Favorite' : '☆ Favorite' }}
    </button>

    <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>

    <button type="button" @click.stop="emit('change-temperature-unit')">
      온도 단위 변경
    </button>
    <p>
      temperature now: {{ displayTemperature(props.weather.temp) }}°{{ props.temperatureUnit }}
    </p>

    <span v-if="props.weather.temp >= 25" class="temperature-status hot">🥵 더움</span>
    <span v-else-if="props.weather.temp <= 10" class="temperature-status cold">🥶 추움</span>
    <span v-else class="temperature-status cool">🍃 시원함</span>

    <button
      type="button"
      class="detail-button"
      @click.stop="emit('show-detail', props.weather.name, props.weather.status)"
    >
      Details
    </button>
  </article>
</template>
