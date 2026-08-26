<template>
  <section class="dashboard-card">
    <header v-if="$slots.title" class="dashboard-card_title">
      <slot name="title" />
    </header>

    <slot />
  </section>
</template>
