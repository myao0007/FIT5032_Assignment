<template>
  <div class="auth-bg">
    <div class="signup-card">
      <h2 class="fw-bold mb-4 text-center">Login</h2>

      <form @submit.prevent="submitForm" novalidate>
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model.trim="formData.email" @input="validateEmailInput"
            :class="{ 'is-invalid': errors.email }" placeholder="you@example.com" required />
          <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="formData.password"
              @input="validatePassword" :class="{ 'is-invalid': errors.password }" required />
            <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
          </div>
        </div>

        <!-- Submit -->
        <button class="btn-primary-custom" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Signing In...' : 'Sign in' }}
        </button>
        <p v-if="okMsg" class="text-success mt-2 text-center">{{ okMsg }}</p>
        <p v-if="errorMsg" class="text-danger mt-2 text-center">{{ errorMsg }}</p>

        <p class="text-center mt-3">
          Don't have an account?
          <router-link to="/register">Create one</router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, getUserProfile } from '@/firebase/auth.js'
import { authComputed } from '@/store/userAuth.js'

const router = useRouter()

// Check if there is already a login session
onMounted(() => {
  // 检查Firebase认证状态
  if (authComputed.isAuthenticated.value) {
    // 根据用户角色重定向
    if (authComputed.isAdmin.value) {
      router.push('/profile')
    } else {
      router.push('/home')
    }
  }
})

const formData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null
})

const okMsg = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const validateEmailInput = () => {
  const email = formData.value.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    errors.value.email = 'Email is required.'
  } else if (!emailPattern.test(email)) {
    errors.value.email = 'Please enter a valid email.'
  } else {
    errors.value.email = null
  }
}

const validatePassword = () => {
  const password = formData.value.password

  if (!password) {
    errors.value.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters.'
  } else {
    errors.value.password = null
  }
}

const submitForm = async () => {
  // 清空错误和消息
  errors.value.email = errors.value.password = ''
  errorMsg.value = ''
  okMsg.value = ''

  // 前端校验
  validateEmailInput()
  validatePassword()
  if (errors.value.email || errors.value.password) return

  isLoading.value = true

  try {
    console.log('Login submitted:', formData.value)

    // 使用Firebase认证
    const result = await loginUser(formData.value.email, formData.value.password)

    if (result.success) {
      console.log('User logged in:', result.user)
      okMsg.value = 'Login successful! Redirecting...'
      // 简单：登录成功后读取角色再决定跳转
      let role = 'user'
      try {
        const profile = await getUserProfile(result.user.uid)
        if (profile.success) role = profile.data.role || 'user'
      } catch (e) { }
      router.replace(role === 'admin' ? '/profile' : '/home')
    } else {
      // 根据错误类型显示不同的错误消息
      if (result.error.includes('user-not-found')) {
        errorMsg.value = 'No account found with this email.'
      } else if (result.error.includes('wrong-password') || result.error.includes('invalid-credential')) {
        errorMsg.value = 'Invalid email or password.'
      } else if (result.error.includes('too-many-requests')) {
        errorMsg.value = 'Too many attempts. Please try again later.'
      } else {
        errorMsg.value = result.error || 'Login failed. Please try again.'
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMsg.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>


<style scoped>
/* 背景 */
.auth-bg {
  --nav-h: 64px;
  min-height: calc(100vh - var(--nav-h));
  display: flex;
  align-items: flex-start;
  align-items: center;
  justify-content: center;
  padding: 84px 24px 24px;
  background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}

/* 卡片 */
.signup-card {
  width: 100%;
  max-width: 520px;
  min-height: min-content;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .12);
  padding: 32px 28px;
}

.signup-card h2 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 18px;
  color: #262c67;
}

/* 表单宽度（让输入框看起来不那么长） */
.signup-card form {
  max-width: 360px;
  /* ← 原来 100%/很长；现在更协调 */
  margin: 0 auto;
}

/* 输入框：统一高度与圆角 */
.form-control {
  width: 100%;
  height: 50px;
  /* 统一高度 */
  padding: 10px 14px;
  /* 视觉舒适的内边距 */
  border-radius: 10px !important;
  /* 和你的整体风格一致 */
  font-size: 1rem;
  box-shadow: none;
}

/* 输入组中的输入框圆角处理 */
.input-group .form-control {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* 输入组中的按钮圆角处理 */
.input-group .btn {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
  height: 50px;
  /* 确保和输入框同高 */
}

/* 自定义密码可见性按钮样式 */
.input-group .btn-outline-secondary {
  border-color: #ced4da !important;
  /* 使用与输入框相同的边框颜色 */
  color: #6c757d !important;
  /* 灰色图标 */
  background-color: transparent !important;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa !important;
  /* 浅灰色悬停背景 */
  border-color: #ced4da !important;
  color: #6c757d !important;
}

/* 在验证错误状态下保持按钮样式 */
.input-group .form-control.is-invalid+.btn-outline-secondary {
  border-color: #dc3545 !important;
  /* 错误状态下的边框颜色 */
  border-left: none;
  /* 移除左边框，与输入框边框融合 */
}

/* 确保验证状态下的圆角 */
.form-control.is-invalid {
  border-radius: 10px !important;
}

.input-group .form-control.is-invalid {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* 修改所有输入框的 placeholder 颜色 */
.form-control::placeholder {
  color: #8a8a8a;
  /* 和提示文字保持一致 */
  opacity: 1;
  /* Safari / Firefox 默认会加透明度，强制设为不透明 */
}

/* 输入框 */
.form-control.is-invalid {
  border-color: #dc3545;
}

/* 修复输入组中按钮的圆角 */
.input-group .btn {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

/* 保持输入框在验证状态下的圆角 */
.input-group .form-control:not(:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: .9rem;
}

/* 星号 */
.form-label::after {
  content: " *";
  color: #dc3545;
  font-weight: 300;
}

/* 按钮 */
.btn-primary-custom {
  display: block;
  min-width: 160px;
  padding: 10px 24px;
  margin: 16px auto 0;
  border-radius: 10px;
  background: #262c67;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover:not(:disabled) {
  background: #1e2349;
  transform: translateY(-1px);
}

.btn-primary-custom:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 加载动画 */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* 成功和错误消息样式 */
.text-success {
  color: #28a745 !important;
  font-weight: 500;
  font-size: 0.95rem;
}

.text-danger {
  color: #dc3545 !important;
  font-weight: 500;
  font-size: 0.95rem;
}
</style>
