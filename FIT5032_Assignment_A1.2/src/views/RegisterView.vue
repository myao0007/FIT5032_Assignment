<template>
  <div class="auth-bg">
    <div class="signup-card">
      <h2 class="fw-bold mb-4 text-center">Register</h2>

      <form @submit.prevent="onRegister" novalidate>
        <!-- NEW: Username -->
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model.trim="reg.username" :class="{ 'is-invalid': regErr.username }"
            placeholder="Your username" required />
    
          <small class="form-hint">No more than 10 characters</small>
          <div class="invalid-feedback" v-if="regErr.username">{{ regErr.username }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model.trim="reg.email" :class="{ 'is-invalid': regErr.email }"
            placeholder="you@example.com" required>
          <div class="invalid-feedback" v-if="regErr.email">{{ regErr.email }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="reg.password" :class="{ 'is-invalid': regErr.password }"
            required>
          <ul class="password-rules mt-2">
            <li :class="lenClass">8-32 characters</li>
            <li :class="caseClass">At least one uppercase and one lowercase</li>
            <li :class="digitClass">At least one number (0-9)</li>
          </ul>
          <div class="invalid-feedback" v-if="regErr.password">{{ regErr.password }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-control" v-model="reg.confirm" :class="{ 'is-invalid': regErr.confirm }"
            required>
          <div class="invalid-feedback" v-if="regErr.confirm">{{ regErr.confirm }}</div>
        </div>


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


const reg = reactive({ username: '', email: '', password: '', confirm: '' })

const regErr = reactive({ username: '', email: '', password: '', confirm: '' })

const okMsg = ref('')


function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }


function wordCount(str) {
  return (str || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

const lenClass = computed(() => !reg.password ? 'neutral' :
  (reg.password.length >= 8 && reg.password.length <= 32 ? 'valid' : 'invalid'))
const caseClass = computed(() => !reg.password ? 'neutral' :
  (/[a-z]/.test(reg.password) && /[A-Z]/.test(reg.password) ? 'valid' : 'invalid'))
const digitClass = computed(() => !reg.password ? 'neutral' :
  (/\d/.test(reg.password) ? 'valid' : 'invalid'))

function onRegister() {

  regErr.username = regErr.email = regErr.password = regErr.confirm = ''


  if (!reg.username) {
    regErr.username = 'Username is required.'
  } else if (reg.username.length > 10) {
    regErr.username = 'No more than 10 characters.'
  }

  if (!reg.email) regErr.email = 'Email is required.'
  else if (!validateEmail(reg.email)) regErr.email = 'Please enter a valid email.'

  if (!reg.password) regErr.password = 'Password is required.'
  else if (lenClass.value !== 'valid' || caseClass.value !== 'valid' || digitClass.value !== 'valid')
    regErr.password = 'Password does not meet all requirements.'

  if (!reg.confirm) regErr.confirm = 'Please confirm your password.'
  else if (reg.confirm !== reg.password) regErr.confirm = 'Passwords do not match.'


  if (!regErr.username && !regErr.email && !regErr.password && !regErr.confirm) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
 
    list.push({ username: reg.username, email: reg.email, password: reg.password })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))

    okMsg.value = 'Account created successfully!'
    setTimeout(() => router.push('/profile'), 800)
  }
}
</script>

<style scoped>

.auth-bg {
  --nav-h: 64px;
  min-height: calc(100vh - var(--nav-h));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}


.signup-card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .12);
  padding: 32px 28px;
}


.signup-card form {
  max-width: 320px;

  margin: 0 auto;
}


.signup-card h2 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 18px;
}


.mb-3 {
  margin-bottom: 14px !important;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: .95rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  height: 24px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 1rem;

  border: 1px solid #ccc;

  box-shadow: none;

}

.form-control.is-invalid {
  border-color: #dc3545;
  padding-right: 2rem;
  background-repeat: no-repeat;
  background-position: right .65rem center;
  background-size: 1rem 1rem;
  box-shadow: none !important;


  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23dc3545'%3E%3Ccircle cx='8' cy='8' r='7' stroke-width='2'/%3E%3Cline x1='8' y1='4' x2='8' y2='9' stroke-width='2'/%3E%3Ccircle cx='8' cy='12' r='1' fill='%23dc3545'/%3E%3C/svg%3E");
}

.invalid-feedback {
  color: #dc3545;
  font-size: .9rem;
  margin-top: .35rem;
}





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


.btn-primary-custom {
  display: block;
  width: auto;
  min-width: 160px;
  padding: 10px 24px;
  margin: 16px auto 0;
  height: auto;
  border-radius: 10px;
  background: #151a4b;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform .02s ease, filter .2s ease;
}

.btn-primary-custom:hover {
  filter: brightness(1.08);
}

.btn-primary-custom:active {
  transform: translateY(1px);
}


.text-center.mt-3 {
  margin-top: 18px !important;
  line-height: 1.45;
  font-size: .92rem;
  color: #4d4d4d;
}


@media (max-width:480px) {
  .signup-card {
    padding: 24px 18px;
    border-radius: 14px;
  }

  .signup-card form {
    max-width: 100%;
  }

  .form-control {
    height: 42px;
  }

  .btn-primary-custom {
    height: 46px;
  }
}

.signup-card a {
  color: #151a4b;

  font-weight: 600;
  text-decoration: none;

}

.signup-card a:hover,
.signup-card a:focus {
  text-decoration: underline;

}

.signup-card a:visited {
  color: #151a4b;

}

.form-hint {
  display: block;
  margin-top: .25rem;
  font-size: .85rem;
  line-height: 1.4;
  color: #6c757d;   
}
</style>