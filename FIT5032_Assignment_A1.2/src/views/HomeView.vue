<template>
  <div class="page-root">
    <section class="hero d-flex align-items-center">
      <div class="text-block">
        <span class="she-big">SHE</span>
        <span class="she-normal">speaks in whispers,</span><br />
        <span class="she-normal">Her words like warm rain,</span><br />
        <span class="she-normal">Healing hearts quietly,</span><br />
        <span class="she-normal">Easing unspoken pain.</span>
        <h3 class="welcome-title mt-5">Welcome, {{ userName || 'Guest' }}!</h3>
      </div>
    </section>

    <section class="content-block">
      <div class="container-fluid py-5">
        <div class="row g-4">
          <div class="col-12 col-md-6 col-xl-4" v-for="i in 3" :key="i">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">Block {{ i }}</h5>
                <p class="mb-0">Your content here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { authComputed } from '@/store/userAuth.js'
import { auth } from '@/firebase/config.js'

// Priority order: store.profile.username → store.user.displayName → auth.currentUser.displayName → email prefix
const userName = ref('')
watchEffect(() => {
  const storeName = authComputed.userName.value || ''
  const liveUser = auth.currentUser
  const liveName = liveUser?.displayName || liveUser?.email?.split('@')[0] || ''
  userName.value = storeName || liveName
})
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}

.hero {
  min-height: calc(100vh - 64px);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.content-block {
  background: transparent;
}

.text-block {
  max-width: 600px;
  color: #1f2233;
  font-family: 'Georgia', serif;
  line-height: 1.8;
}

.welcome-title {
  margin-top: 2rem;
  text-align: center;
  color: #151a4b;
  font-size: 2.4rem;
  font-weight: 800;
}

.she-big {
  font-size: 3rem;
  font-weight: bold;
  color: #151a4b;
  margin-right: .3rem;
}

.she-normal {
  font-size: 1.8rem;
  font-weight: normal;
  color: #151a4b;
}
</style>