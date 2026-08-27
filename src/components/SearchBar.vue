<script setup>
const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

function updateQuery(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <input
    type="text"
    :value="props.currentQuery"
    placeholder="enter the city"
    @input="updateQuery"
  />
</template>
