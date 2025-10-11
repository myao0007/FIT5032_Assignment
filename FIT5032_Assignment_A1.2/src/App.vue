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
  background: white;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>