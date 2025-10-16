<template>
  <SiteHeader />
  <router-view />
  <AIFloatingButton />
</template>

<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
import AIFloatingButton from '@/components/AIFloatingButton.vue'
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