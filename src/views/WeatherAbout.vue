<script setup>
import { inject } from 'vue'

const appTitle = inject('appTitle', 'Weather Dashboard')
</script>

<template>
  <section>
    <h2>서비스 소개</h2>
    <p>
      <strong>{{ appTitle }}</strong
      >is practice for vue3
    </p>

    <h3>주요 기능</h3>
    <p>- 도시별 실시간 날씨 조회</p>
    <p>- 도시 검색</p>
    <p>- 섭씨/화씨 변환</p>
    <p>- 상세 날씨 정보 제공 날씨</p>
    - 버셀 환경변수 확인용 커밋
    <p>정보를 API 를 활용하여 위트있게 가져옵니다.</p>
  </section>
</template>
