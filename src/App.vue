<script setup>
import UnitToggler from './components/UnitToggler.vue'
import { provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

provide('appTitle', 'Vue Weather Dashboard')
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Vue Weather Dashboard</h1>
      <nav>
        <UnitToggler />
        <RouterLink to="/" class="nav-button">Home</RouterLink>
        <RouterLink to="/about" class="nav-button">About</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
