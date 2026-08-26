<script setup>
import { ref } from 'vue'

const position = ref('')
const tagName = ref('')
const getOnlyEvent = (e) => {
  position.value = `좌표: X=${e.clientX}, Y=${e.clientY}`
}
const getWithParam = (name, e) => {
  tagName.value = `대상: ${name} / 클락된 태그: ${e.target.tagName}`
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on event object($event)</h2>
    <p>좌표: {{ position }}</p>
    <p>태그: {{ tagName }}</p>
    <button @click="getOnlyEvent">click position</button>
    <button @click="getWithParam('userA', $event)">userinfo and tag</button>
  </div>
</template>
