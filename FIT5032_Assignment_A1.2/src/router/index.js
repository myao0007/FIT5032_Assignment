// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import PodcastsView from '@/views/PodcastsView.vue'
import PodcastDetailView from '@/views/PodcastDetailView.vue'
import EchoesDetailView from '@/views/EchoesDetailView.vue'
import SoulSistersDetailView from '@/views/SoulSistersDetailView.vue'
import BloomDetailView from '@/views/BloomDetailView.vue'
import TreeHoleView from '@/views/TreeHoleView.vue'
import ShareThoughtsView from '@/views/ShareThoughtsView.vue'
import EventView from '@/views/EventView.vue'
import EventDetailView from '@/views/EventDetailView.vue'
import BookingView from '@/views/BookingView.vue'
import FirestoreTestView from '@/views/FirestoreTestView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'

import { authComputed, initAuth } from '@/store/userAuth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/podcasts', name: 'podcasts', component: PodcastsView },
    { path: '/podcast/:id', name: 'podcast-detail', component: PodcastDetailView },
    { path: '/echoes', name: 'echoes-detail', component: EchoesDetailView },
    { path: '/soul-sisters', name: 'soul-sisters-detail', component: SoulSistersDetailView },
    { path: '/bloom', name: 'bloom-detail', component: BloomDetailView },
    { path: '/treehole', name: 'treehole', component: TreeHoleView },
    { path: '/share-thoughts', name: 'share-thoughts', component: ShareThoughtsView },
    { path: '/live', name: 'event', component: EventView },
    { path: '/event/:id', name: 'event-detail', component: EventDetailView },
    { path: '/booking/:id', name: 'booking', component: BookingView },
    { path: '/firestore-test', name: 'firestore-test', component: FirestoreTestView },
    { path: '/home', name: 'home', component: HomeView },

    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },

    // Admin only
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true, requiresAdmin: true } },

    { path: '/:pathMatch(.*)*', redirect: '/home' }
  ]
})

// Initialize authentication state
initAuth()

/** Route guard: Authentication + Role */
router.beforeEach(async (to, from, next) => {
  // Wait for authentication state to load
  while (authComputed.isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  const isLoggedIn = authComputed.isAuthenticated.value
  const isAdmin = authComputed.isAdmin.value

  // Guest only access (login / register)
  if (to.meta.guestOnly && isLoggedIn) {
    // If user is already logged in, redirect to appropriate page
    if (isAdmin) {
      return next({ name: 'profile' })
    } else {
      return next({ name: 'home' })
    }
  }

  // Requires authentication
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Requires admin
  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router
