<script setup>
import { ref } from 'vue'
const count = ref(0)
const showAlert = () => {
  alert('함수가 성공적으로 호출되었습니다!')
}
</script>

<template>
  <div>
    <h2>event handling</h2>
    <p>current count: {{ count }}</p>
    <button @click="count++">1 plus</button>
    <br />
    <h3>script function</h3>
    <button @click="showAlert">alert</button>
  </div>
</template>
