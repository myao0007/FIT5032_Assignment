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
            <button type="button" class="btn btn-outline-secondary" @click="togglePasswordVisibility">
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
  // Check Firebase authentication state
  if (authComputed.isAuthenticated.value) {
    // Redirect based on user role
    if (authComputed.isAdmin.value) {
      router.push('/admin-dashboard')
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
  // Clear errors and messages
  errors.value.email = errors.value.password = ''
  errorMsg.value = ''
  okMsg.value = ''

  // Frontend validation
  validateEmailInput()
  validatePassword()
  if (errors.value.email || errors.value.password) return

  isLoading.value = true

  try {
    console.log('Login submitted:', formData.value)

    // Use Firebase authentication
    const result = await loginUser(formData.value.email, formData.value.password)

    if (result.success) {
      console.log('User logged in:', result.user)
      okMsg.value = 'Login successful! Redirecting...'
      // Simple: read role after successful login to decide redirect
      let role = 'user'
      try {
        const profile = await getUserProfile(result.user.uid)
        if (profile.success) role = profile.data.role || 'user'
      } catch (e) { }
      router.replace(role === 'admin' ? '/admin-dashboard' : '/home')
    } else {
      // Display different error messages based on error type
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


<style>
/* Global styles to prevent white bars */
body {
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%) !important;
  min-height: 100vh !important;
}

html {
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%) !important;
  min-height: 100vh !important;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%) !important;
  min-height: 100vh !important;
}
</style>

<style scoped>
/* Background */
.auth-bg {
  --nav-h: 64px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 84px 24px 0;
  background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%);
}

/* Card */
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
  color: #2c3e50;
}

/* Form width (make input fields look less long) */
.signup-card form {
  max-width: 360px;
  /* ← Originally 100%/very long; now more coordinated */
  margin: 0 auto;
}

/* Input fields: unified height and rounded corners */
.form-control {
  width: 100%;
  height: 50px;
  /* Unified height */
  padding: 10px 14px;
  /* Visually comfortable padding */
  border-radius: 10px !important;
  /* Consistent with your overall style */
  font-size: 1rem;
  box-shadow: none;
}

/* Input group input field rounded corner handling */
.input-group .form-control {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* Input group button rounded corner handling */
.input-group .btn {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
  height: 50px;
  /* Ensure same height as input field */
}

/* Custom password visibility button styles */
.input-group .btn-outline-secondary {
  border-color: #ced4da !important;
  /* Use same border color as input field */
  color: #6c757d !important;
  /* Gray icon */
  background-color: transparent !important;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa !important;
  /* Light gray hover background */
  border-color: #ced4da !important;
  color: #6c757d !important;
}

/* Maintain button style in validation error state */
.input-group .form-control.is-invalid+.btn-outline-secondary {
  border-color: #dc3545 !important;
  /* Border color in error state */
  border-left: none;
  /* Remove left border, blend with input field border */
}

/* Ensure rounded corners in validation state */
.form-control.is-invalid {
  border-radius: 10px !important;
}

.input-group .form-control.is-invalid {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* Modify all input field placeholder colors */
.form-control::placeholder {
  color: #8a8a8a;
  /* Keep consistent with hint text */
  opacity: 1;
  /* Safari / Firefox default adds transparency, force to opaque */
}

/* Input fields */
.form-control.is-invalid {
  border-color: #dc3545;
}

/* Fix rounded corners of buttons in input group */
.input-group .btn {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

/* Maintain input field rounded corners in validation state */
.input-group .form-control:not(:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: .9rem;
}

/* Asterisk */
.form-label::after {
  content: " *";
  color: #dc3545;
  font-weight: 300;
}

/* Button */
.btn-primary-custom {
  display: block;
  min-width: 160px;
  padding: 10px 24px;
  margin: 16px auto 0;
  border-radius: 10px;
  background: #2c3e50;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover:not(:disabled) {
  background: #1a252f;
  transform: translateY(-1px);
}

.btn-primary-custom:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* Loading animation */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Success and error message styles */
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

/* Link styles */
a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  color: #1a252f;
  text-decoration: underline;
}
</style>
