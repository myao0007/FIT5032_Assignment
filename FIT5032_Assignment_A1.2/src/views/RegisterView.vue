<template>
  <div class="auth-bg">
    <div class="signup-card">
      <h2 class="fw-bold mb-4 text-center">Create an Account</h2>

      <form @submit.prevent="register" novalidate>

        <!-- Username -->
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model.trim="formData.username" @input="validateUsername"
            :class="{ 'is-invalid': errors.username }" placeholder="Your username" required />
          <small class="form-hint">No more than 10 characters</small>
          <div class="invalid-feedback" v-if="errors.username">{{ errors.username }}</div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model.trim="formData.email" @input="validateEmailInput"
            :class="{ 'is-invalid': errors.email }" placeholder="you@example.com" required />
          <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
        </div>

        <!-- Date of Birth -->
        <div class="mb-3">
          <label class="form-label">Date of Birth</label>
          <div class="input-group date-picker-wrapper">
            <input type="text" class="form-control" v-model="formData.dob" placeholder="dd/mm/yyyy" @input="formatDateInput"
              :class="{ 'is-invalid': errors.dob }" maxlength="10" required />
            <button type="button" class="btn btn-outline-secondary" @click="openDatePicker">
              <i class="bi bi-calendar3"></i>
            </button>
            <input type="date" ref="datePicker" class="date-picker-hidden" @change="handleDateChange" />
            <div class="invalid-feedback" v-if="errors.dob">{{ errors.dob }}</div>
          </div>
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

          <ul class="password-rules mt-2">
            <li :class="lenClass">8-32 characters</li>
            <li :class="caseClass">At least one uppercase and one lowercase</li>
            <li :class="digitClass">At least one number (0-9)</li>
          </ul>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <div class="input-group">
            <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control" v-model="formData.confirmPassword"
              @input="validateConfirmPassword" :class="{ 'is-invalid': errors.confirmPassword }" required />
            <button type="button" class="btn btn-outline-secondary" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
          </div>
        </div>

        <!-- Submit -->
        <button class="btn-primary-custom" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </button>
        <p v-if="okMsg" class="text-success mt-2 text-center">{{ okMsg }}</p>
        <p v-if="errorMsg" class="text-danger mt-2 text-center">{{ errorMsg }}</p>

        <p class="text-center mt-3">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/firebase/auth.js'
import { authComputed } from '@/store/userAuth.js'

const router = useRouter()

// Check if user is already logged in
onMounted(() => {
    if (authComputed.isAuthenticated.value) {
        // If already logged in, redirect to appropriate page
        if (authComputed.isAdmin.value) {
            router.push('/profile')
        } else {
            router.push('/home')
        }
    }
})

const formData = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: ''
})

const errors = ref({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
    dob: null
})

const okMsg = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// ===== DatePicker（保留你的交互）=====
const datePicker = ref(null)
const openDatePicker = () => { datePicker.value?.showPicker?.() }
const handleDateChange = (e) => {
  const date = new Date(e.target.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  formData.value.dob = `${day}/${month}/${year}`
  validateDob()
}

// 格式化日期输入，自动添加斜杠
const formatDateInput = (event) => {
  let value = event.target.value.replace(/\D/g, '') // 只保留数字
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }
  if (value.length >= 5) {
    value = value.substring(0, 5) + '/' + value.substring(5, 9)
  }
  
  formData.value.dob = value
  validateDob()
}


// ===== 校验（保留你的逻辑）=====
const validateUsername = () => {
  errors.value.username = !formData.value.username ? 'Username is required.' :
    formData.value.username.length > 10 ? 'No more than 10 characters.' : ''
}
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const validateEmailInput = () => {
  errors.value.email = !formData.value.email ? 'Email is required.' :
    !validateEmail(formData.value.email) ? 'Please enter a valid email.' : ''
}
const lenClass = computed(() => !formData.value.password ? 'neutral' : (formData.value.password.length >= 8 && formData.value.password.length <= 32 ? 'valid' : 'invalid'))
const caseClass = computed(() => !formData.value.password ? 'neutral' : (/[a-z]/.test(formData.value.password) && /[A-Z]/.test(formData.value.password) ? 'valid' : 'invalid'))
const digitClass = computed(() => !formData.value.password ? 'neutral' : (/\d/.test(formData.value.password) ? 'valid' : 'invalid'))
const validatePassword = () => {
  errors.value.password = !formData.value.password ? 'Password is required.' :
    (lenClass.value !== 'valid' || caseClass.value !== 'valid' || digitClass.value !== 'valid')
      ? 'Password does not meet all requirements.' : ''
  if (formData.value.confirmPassword) validateConfirmPassword()
}
const validateConfirmPassword = () => {
  errors.value.confirmPassword = !formData.value.confirmPassword ? 'Please confirm your password.' :
    formData.value.confirmPassword !== formData.value.password ? 'Passwords do not match.' : ''
}
const validateDob = () => {
  const dob = formData.value.dob
  
  if (!dob) {
    errors.value.dob = 'Date of Birth is required.'
    return
  }
  
  // 检查日期格式 (dd/mm/yyyy)
  const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  const match = dob.match(datePattern)
  
  if (!match) {
    errors.value.dob = 'Please enter date in dd/mm/yyyy format.'
    return
  }
  
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)
  
  // 验证日期有效性
  const date = new Date(year, month - 1, day)
  const today = new Date()
  
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    errors.value.dob = 'Please enter a valid date.'
  } else if (date >= today) {
    errors.value.dob = 'Date of birth cannot be in the future.'
  } else {
    errors.value.dob = ''
  }
}

const register = async () => {
  // 先清空错误和消息
  errors.value.username = errors.value.email = errors.value.password = errors.value.confirmPassword = errors.value.dob = ''
  errorMsg.value = ''
  okMsg.value = ''

  // 前端二次校验
  validateUsername()
  validateEmailInput()
  validatePassword()
  validateConfirmPassword()
  validateDob()
  if (errors.value.username || errors.value.email || errors.value.password || errors.value.confirmPassword || errors.value.dob) return

  isLoading.value = true

  try {
    // Prepare user data
    const userData = {
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      dob: formData.value.dob
    }

    // Register with Firebase
    const result = await registerUser(userData)

    if (result.success) {
      console.log('User registered:', result.user)
      okMsg.value = 'Account created successfully! Redirecting...'

      // 等待状态更新后重定向
      setTimeout(() => {
        if (authComputed.isAdmin.value) {
          router.push('/profile')
        } else {
          router.push('/home')
        }
      }, 1500)
    } else {
      // 根据错误类型显示不同的错误消息
      if (result.error.includes('email-already-in-use')) {
        errorMsg.value = 'This email is already registered. Please use a different email or try logging in.'
      } else if (result.error.includes('weak-password')) {
        errorMsg.value = 'Password is too weak. Please choose a stronger password.'
      } else if (result.error.includes('invalid-email')) {
        errorMsg.value = 'Please enter a valid email address.'
      } else {
        errorMsg.value = result.error || 'Registration failed. Please try again.'
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    errorMsg.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value
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

.form-hint {
  display: block;
  margin-top: .25rem;
  font-size: .85rem;
  line-height: 1.4;
  color: #8a8a8a;
  /* NEW: 灰色，和密码规则一致 */
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

/* 密码规则 */
.password-rules {
  list-style: none;
  padding-left: 0;
  margin: .35rem 0 0;
  font-size: .85rem;
  line-height: 1.35;
  color: #7a7a7a;
}

.password-rules .neutral {
  color: #8a8a8a;
}

.password-rules .invalid {
  color: #d64545;
}

.password-rules .valid {
  color: #239a3b;
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

.date-picker-wrapper {
  position: relative;
  /* 为隐藏的日期选择器创建定位上下文 */
}

.date-picker-hidden {
  position: absolute;
  /* 绝对定位 */
  opacity: 0;
  /* 完全透明 */
  width: 100%;
  /* 与父元素同宽 */
  height: 100%;
  /* 与父元素同高 */
  top: 0;
  left: 0;
  z-index: -1;
  /* 放在底层 */
}

/* 当日期选择器打开时，确保它显示在正确位置 */
.date-picker-hidden::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  top: 100%;
  /* 显示在输入框下方 */
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>