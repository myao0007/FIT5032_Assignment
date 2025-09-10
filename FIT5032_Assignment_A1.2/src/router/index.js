// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'

import { authComputed, initAuth } from '@/store/userAuth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView },

    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },

    // 仅管理员可见
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true, requiresAdmin: true } },

    { path: '/:pathMatch(.*)*', redirect: '/home' }
  ]
})

// 初始化认证状态
initAuth()

/** 路由守卫：鉴权 + 角色 */
router.beforeEach(async (to, from, next) => {
  // 等待认证状态加载完成
  while (authComputed.isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  const isLoggedIn = authComputed.isAuthenticated.value
  const isAdmin = authComputed.isAdmin.value

  // 仅游客可访问（login / register）
  if (to.meta.guestOnly && isLoggedIn) {
    // 如果用户已经登录，重定向到适当的页面
    if (isAdmin) {
      return next({ name: 'profile' })
    } else {
      return next({ name: 'home' })
    }
  }

  // 需要登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 需要管理员
  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router
