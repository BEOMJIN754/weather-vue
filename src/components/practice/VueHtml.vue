<script setup>
const rawHtmlData = 'this text is <span style="color: purple; font-weight: bold">pulple text</span>'
</script>

<template>
  <div class="practice-section">
    <h2>v-html 디렉티브 학습</h2>
    <h3>일반 보간법 {{}} 사용 결과:</h3>
    <p>{{ rawHtmlData }}</p>
    <br />
    <h3>v-html 디렉티브 사용 결과:</h3>
    <p v-html="rawHtmlData"></p>
  </div>
</template>
