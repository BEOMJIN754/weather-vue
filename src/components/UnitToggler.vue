<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div>
    <span>현재 단위: {{ configStore.unitSymbol }}</span>
    <el-button type="success" @click="configStore.toggleUnit"> 단위 변경 </el-button>
  </div>
</template>
