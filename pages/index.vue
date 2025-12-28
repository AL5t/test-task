
<template>
  <div class="home">
    <h1>Главная страница</h1>
    <div>
      <TypePositions/>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypePositions from '@/pages/type-positions.vue';

definePageMeta({
  title: 'Главная',
  middleware: 'auth'
})
</script>

<style scoped>

</style>
