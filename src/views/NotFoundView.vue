<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <h1>404</h1>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <RouterLink :to="{ name: 'WeatherHome' }">홈으로 이동</RouterLink>
  </section>
</template>
