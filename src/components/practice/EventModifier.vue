<script setup>
const handleLink = () => {
  alert('링크 따라 가지 않아요')
}

const handleBox = () => {
  alert('im your father')
}
// 💡 템플릿에서 호출할 함수 정의 (alert는 window.alert와 동일)
const handleChild1 = () => {
  alert('1번 자식 클릭!')
}

const handleChild2 = () => {
  alert('2번 자식(나만 켜짐) 클릭!')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어(Modifiers) 학습</h2>
    <h3>1) .prevent (기본 동작 막기)</h3>
    <a href="https://www.naver.com" @click.prevent="handleLink">go to naver</a>
    <br />

    <h3>2) .stop (이벤트 버블링 막기)</h3>
    <div @click="handleBox" style="padding: 20px; background-color: #eee">
      <p>부모 영역 (클릭 시 alert 발동)</p>

      <button @click="handleChild1">bubbling</button>
      <button @click="handleChild2">bubbling bye</button>
    </div>
  </div>
</template>
