<script setup>
const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <el-input
    :model-value="props.currentQuery"
    placeholder="검색할 도시 이름을 입력하세요"
    clearable
    @update:model-value="emit('update-query', $event)"
  />
</template>
