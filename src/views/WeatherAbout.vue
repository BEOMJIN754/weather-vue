<script setup>
import { inject } from 'vue'

const appTitle = inject('appTitle', 'Weather Dashboard')
</script>

<template>
  <section>
    <h2>서비스 소개</h2>
    <p>
      <strong>{{ appTitle }}</strong> is practice for Vue 3.
    </p>
    <p>Vue Router, Pinia, Axios, Element Plus 를 하나의 SPA 에서 연결합니다.</p>
  </section>
</template>
