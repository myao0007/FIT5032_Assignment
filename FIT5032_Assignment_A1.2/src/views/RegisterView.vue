<template>
  <div class="auth-bg">
    <div class="signup-card">
      <h2 class="fw-bold mb-4 text-center">Create an Account</h2>

      <form @submit.prevent="onRegister" novalidate>

        <!-- Username -->
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model.trim="reg.username" @input="validateUsername"
            :class="{ 'is-invalid': regErr.username }" placeholder="Your username" required />
          <small class="form-hint">No more than 10 characters</small>
          <div class="invalid-feedback" v-if="regErr.username">{{ regErr.username }}</div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model.trim="reg.email" @input="validateEmailInput"
            :class="{ 'is-invalid': regErr.email }" placeholder="you@example.com" required />
          <div class="invalid-feedback" v-if="regErr.email">{{ regErr.email }}</div>
        </div>

        <!-- Date of Birth -->
        <div class="mb-3">
          <label class="form-label">Date of Birth</label>
          <div class="input-group date-picker-wrapper">
            <input type="text" class="form-control" v-model="reg.dob" placeholder="dd/mm/yyyy" @input="validateDob"
              :class="{ 'is-invalid': regErr.dob }" readonly required />
            <button type="button" class="btn btn-outline-secondary" @click="openDatePicker">
              <i class="bi bi-calendar3"></i>
            </button>
            <input type="date" ref="datePicker" class="date-picker-hidden" @change="handleDateChange" />
            <div class="invalid-feedback" v-if="regErr.dob">{{ regErr.dob }}</div>
          </div>
        </div>


        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group">
            <input :type="showPwd ? 'text' : 'password'" class="form-control" v-model="reg.password"
              @input="validatePassword" :class="{ 'is-invalid': regErr.password }" required />
            <button type="button" class="btn btn-outline-secondary" @click="showPwd = !showPwd">
              <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback" v-if="regErr.password">{{ regErr.password }}</div>
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
            <input :type="showConfirm ? 'text' : 'password'" class="form-control" v-model="reg.confirm"
              @input="validateConfirm" :class="{ 'is-invalid': regErr.confirm }" required />
            <button type="button" class="btn btn-outline-secondary" @click="showConfirm = !showConfirm">
              <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback" v-if="regErr.confirm">{{ regErr.confirm }}</div>
          </div>
        </div>

        <!-- Submit -->
        <button class="btn-primary-custom" type="submit">Create account</button>
        <p v-if="okMsg" class="text-success mt-2">{{ okMsg }}</p>

        <p class="text-center mt-3">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'user_profiles'

const reg = reactive({ username: '', email: '', dob: '', password: '', confirm: '' })
const regErr = reactive({ username: '', email: '', dob: '', password: '', confirm: '' })
const okMsg = ref('')
const showPwd = ref(false)
const showConfirm = ref(false)

const datePicker = ref(null)

const openDatePicker = () => {
  datePicker.value.showPicker()
}



const handleDateChange = (e) => {
  const date = new Date(e.target.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  reg.dob = `${day}/${month}/${year}`
  validateDob()
}

// 实时验证函数
const validateUsername = () => {
  regErr.username = !reg.username ? 'Username is required.' :
    reg.username.length > 10 ? 'No more than 10 characters.' : ''
}

const validateEmailInput = () => {
  regErr.email = !reg.email ? 'Email is required.' :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email) ? 'Please enter a valid email.' : ''
}

const validatePassword = () => {
  regErr.password = !reg.password ? 'Password is required.' :
    (lenClass.value !== 'valid' || caseClass.value !== 'valid' || digitClass.value !== 'valid')
      ? 'Password does not meet all requirements.' : ''
  // 当密码改变时也验证确认密码
  if (reg.confirm) validateConfirm()
}

const validateConfirm = () => {
  regErr.confirm = !reg.confirm ? 'Please confirm your password.' :
    reg.confirm !== reg.password ? 'Passwords do not match.' : ''
}

const lenClass = computed(() => !reg.password ? 'neutral' :
  (reg.password.length >= 8 && reg.password.length <= 32 ? 'valid' : 'invalid'))
const caseClass = computed(() => !reg.password ? 'neutral' :
  (/[a-z]/.test(reg.password) && /[A-Z]/.test(reg.password) ? 'valid' : 'invalid'))
const digitClass = computed(() => !reg.password ? 'neutral' :
  (/\d/.test(reg.password) ? 'valid' : 'invalid'))

const validateDob = () => {
  regErr.dob = !reg.dob ? 'Date of Birth is required.' : ''
}

function onRegister() {
  regErr.username = regErr.email = regErr.password = regErr.confirm = regErr.dob = ''

  if (!reg.username) regErr.username = 'Username is required.'
  else if (reg.username.length > 10) regErr.username = 'No more than 10 characters.'

  if (!reg.email) regErr.email = 'Email is required.'
  else if (!validateEmail(reg.email)) regErr.email = 'Please enter a valid email.'

  if (!reg.password) regErr.password = 'Password is required.'
  else if (lenClass.value !== 'valid' || caseClass.value !== 'valid' || digitClass.value !== 'valid')
    regErr.password = 'Password does not meet all requirements.'

  if (!reg.confirm) regErr.confirm = 'Please confirm your password.'
  else if (reg.confirm !== reg.password) regErr.confirm = 'Passwords do not match.'

  if (!reg.dob) regErr.dob = 'Date of Birth is required.'

  if (!regErr.username && !regErr.email && !regErr.password && !regErr.confirm && !regErr.dob) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    list.push({ username: reg.username, email: reg.email, dob: reg.dob, password: reg.password })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))

    okMsg.value = 'Account created successfully!'
    setTimeout(() => router.push('/profile'), 800)
  }
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
}

.date-picker-wrapper {
  position: relative;  /* 为隐藏的日期选择器创建定位上下文 */
}

.date-picker-hidden {
  position: absolute;  /* 绝对定位 */
  opacity: 0;         /* 完全透明 */
  width: 100%;        /* 与父元素同宽 */
  height: 100%;       /* 与父元素同高 */
  top: 0;
  left: 0;
  z-index: -1;        /* 放在底层 */
}

/* 当日期选择器打开时，确保它显示在正确位置 */
.date-picker-hidden::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  top: 100%;          /* 显示在输入框下方 */
  width: 100%;
  height: 100%;
  cursor: pointer;
}

</style>