<template>
  <div class="container py-5" style="max-width: 560px;">
    <h2 class="fw-bold mb-4 text-center">Login</h2>

    <form @submit.prevent="onLogin" novalidate>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model.trim="email"
               :class="{ 'is-invalid': err.email }" placeholder="you@example.com" required>
        <div class="invalid-feedback" v-if="err.email">{{ err.email }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password"
               :class="{ 'is-invalid': err.password }" required>
        <div class="invalid-feedback" v-if="err.password">{{ err.password }}</div>
      </div>

      <button class="btn btn-primary w-100" type="submit">Sign in</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const email = ref('')
const password = ref('')
const err = reactive({ email: '', password: '' })

function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

function onLogin(){
  err.email = err.password = ''
  if(!email.value) err.email = 'Email is required.'
  else if(!validateEmail(email.value)) err.email = 'Please enter a valid email.'
  if(!password.value) err.password = 'Password is required.'
  else if(password.value.length < 8) err.password = 'At least 8 characters.'
  if(!err.email && !err.password){
    alert('Login form is valid (demo).')
  }
}
</script>