<template>
  <SiteHeader />
  <router-view />
</template>

<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<style>
body {
  margin: 0;
  background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>