import { computed, toValue } from 'vue'
import { useConfigStore } from '@/stores/configStore'

export function useTemperature(celsiusSource) {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const celsius = Number(toValue(celsiusSource))

    if (configStore.unit === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }

    return Math.round(celsius)
  })

  return {
    displayTemp,
    unitSymbol: computed(() => configStore.unitSymbol),
  }
}
