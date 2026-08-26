<script setup>
//import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 기본(축약형: 콜론)</h2>
    <h3>동적 링크 연결</h3>
    <p :href="dynamicUrl">여기를 클릭하면 네이버로 이동이동</p>
    <br />

    <h3>동적 이미지 연결</h3>
    <img: src="logoImgSrc" alt="Vue 로고" style="width: 100px" />
    <input type="number" v-model="boxWidth" step="50" />
    <br />

    <div :style="[baseBoxStyle, { width: boxWidth + 'px' }]">
      <p style="color: white; padding: 10px; text-align: center">
        가로 크기: {{ boxWidth }}px 박스
      </p>
    </div>
  </div>
</template>
