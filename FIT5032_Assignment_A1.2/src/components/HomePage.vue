<template>
    <div class="page-root">
        <!-- FULL-WIDTH, ALWAYS VISIBLE, FIXED TO TOP -->
        <nav class="navbar she-navbar fixed-top w-100">
            <div class="container-fluid">
                <div class="d-flex align-items-center gap-3 w-100">
                    <a class="navbar-brand fw-bold text-light me-3" href="#">SHE</a>

                    <!-- full-width nav row; never collapses -->
                    <ul class="navbar-nav flex-row flex-nowrap w-100 justify-content-between">
                        <!-- using flex-nowrap + between -->
                        <li class="nav-item flex-fill text-center"> 
                            <button class="nav-link btn-linklike w-100" @click="onPodcasts">Podcasts</button>
                            
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onLive">Live</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onTreeHole">Tree Hole</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onDiscover">Discover</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onCurve">Emotional Curve</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onCocreation">Co-creation</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onProfile">Profile</button>
                        </li>

                        <li class="nav-item flex-fill text-center">
                            <button class="nav-link btn-linklike w-100" @click="onAbout">About Policies</button>
                        </li>

                        
                        <li class="nav-item flex-fill text-center">
                            
                            <button class="nav-link btn-login w-100" data-bs-toggle="modal"
                                data-bs-target="#authModal">Login</button> 
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- spacer to avoid content hiding behind fixed navbar -->
        <div class="fixed-top-spacer"></div>

        <!-- FULL-BLEED HERO SECTION (fills viewport height) -->
        <section class="hero d-flex align-items-center">
            <div class="container text-block">
                <h1 class="she-title">
                    <span class="she-big">SHE</span>
                    <span class="she-normal"> speaks in whispers;</span>
                </h1>
                <p>Her words like warm rain,</p>
                <p>Healing hearts quietly,</p>
                <p>Easing unspoken pain.</p>
            </div>
        </section>

        <!-- OPTIONAL: content rows that stretch full width -->
        <section class="content-block">
            <div class="container-fluid py-5">
                <div class="row g-4">
                    <div class="col-12 col-md-6 col-xl-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">Featured</h5>
                                <p class="mb-0">Put your dynamic content or cards here.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">Latest</h5>
                                <p class="mb-0">Another block to prove full-page layout.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">For You</h5>
                                <p class="mb-0">Replace with your own sections later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- AUTH MODAL (Login/Register + validation + localStorage) -->
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ activeTab === 'login' ? 'Login' : 'Register' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    <div class="modal-body">
                        <!-- tabs -->
                        <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                                <button class="nav-link" :class="{ active: activeTab === 'login' }"
                                    @click="activeTab = 'login'">Login</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" :class="{ active: activeTab === 'register' }"
                                    @click="activeTab = 'register'">Register</button>
                            </li>
                        </ul>

                        <!-- Login -->
                        <form v-if="activeTab === 'login'" @submit.prevent="onLogin" novalidate>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model.trim="login.email"
                                    :class="{ 'is-invalid': loginErr.email }" placeholder="you@example.com" required>
                                <div class="invalid-feedback" v-if="loginErr.email">{{ loginErr.email }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" v-model="login.password"
                                    :class="{ 'is-invalid': loginErr.password }" placeholder="At least 8 characters"
                                    required>
                                <div class="invalid-feedback" v-if="loginErr.password">{{ loginErr.password }}</div>
                            </div>
                            <button class="btn btn-primary w-100" type="submit">Sign in</button>
                            <p class="text-success mt-3" v-if="loginOK">Login form is valid ✅ (demo)</p>
                        </form>

                        <!-- Register -->
                        <form v-else @submit.prevent="onRegister" novalidate>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model.trim="reg.email"
                                    :class="{ 'is-invalid': regErr.email }" placeholder="you@example.com" required>
                                <div class="invalid-feedback" v-if="regErr.email">{{ regErr.email }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" v-model="reg.password"
                                    :class="{ 'is-invalid': regErr.password }"
                                    placeholder="At least 8 chars, mixed case & number" required>
                                <div class="invalid-feedback" v-if="regErr.password">{{ regErr.password }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" v-model="reg.confirm"
                                    :class="{ 'is-invalid': regErr.confirm }" placeholder="Repeat your password"
                                    required>
                                <div class="invalid-feedback" v-if="regErr.confirm">{{ regErr.confirm }}</div>
                            </div>
                            <button class="btn btn-success w-100" type="submit">Create account</button>
                            <p class="text-success mt-3" v-if="regOK">Saved to localStorage ✅</p>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <small class="text-muted">Modal-based authentication with validation</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

/* Nav button stubs */
function onPodcasts() { alert('Podcasts clicked (stub).') }
function onLive() { alert('Live clicked (stub).') }
function onTreeHole() { alert('Tree Hole clicked (stub).') }
function onDiscover() { alert('Discover clicked (stub).') }
function onCurve() { alert('Emotional Curve clicked (stub).') }
function onCocreation() { alert('Co-creation clicked (stub).') }
function onProfile() { alert('Profile clicked (stub).') }
function onAbout() { alert('About+Policies clicked (stub).') }

/* Auth state */
const activeTab = ref('login')
const login = reactive({ email: '', password: '' })
const loginErr = reactive({ email: '', password: '' })
const loginOK = ref(false)

const reg = reactive({ email: '', password: '', confirm: '' })
const regErr = reactive({ email: '', password: '', confirm: '' })
const regOK = ref(false)

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

function onLogin() {
    loginOK.value = false
    loginErr.email = loginErr.password = ''
    if (!login.email) loginErr.email = 'Email is required.'
    else if (!validateEmail(login.email)) loginErr.email = 'Please enter a valid email.'
    if (!login.password) loginErr.password = 'Password is required.'
    else if (login.password.length < 8) loginErr.password = 'At least 8 characters.'
    if (!loginErr.email && !loginErr.password) loginOK.value = true
}

function onRegister() {
    regOK.value = false
    regErr.email = regErr.password = regErr.confirm = ''
    const hasLower = /[a-z]/.test(reg.password)
    const hasUpper = /[A-Z]/.test(reg.password)
    const hasDigit = /\d/.test(reg.password)
    if (!reg.email) regErr.email = 'Email is required.'
    else if (!validateEmail(reg.email)) regErr.email = 'Please enter a valid email.'
    if (!reg.password) regErr.password = 'Password is required.'
    else if (reg.password.length < 8) regErr.password = 'At least 8 characters.'
    else if (!(hasLower && hasUpper && hasDigit)) regErr.password = 'Use upper/lowercase and a number.'
    if (!reg.confirm) regErr.confirm = 'Please confirm your password.'
    else if (reg.confirm !== reg.password) regErr.confirm = 'Passwords do not match.'
    if (!regErr.email && !regErr.password && !regErr.confirm) {
        localStorage.setItem('registered_user', JSON.stringify({ email: reg.email }))
        regOK.value = true
    }
}
</script>

<style>
/* ===== Global resets ===== */
html,
body,
#app {
    height: 100%;
}

body {
    margin: 0;
    min-height: 100vh;
    /* Apply pink gradient background directly to body */
    background: linear-gradient(135deg, #ffc9df 0%, #f3bada 40%, #e8eaff 100%);
    background-attachment: fixed;
    /* Optional: keeps background fixed while scrolling */
}

/* ===== Page root ===== */
.page-root {
    min-height: 100vh;
    background: transparent;
    /* Do not override with solid white */
}

/* ===== Navbar ===== */
.she-navbar {
    background-color: #151a4b;
}

.she-navbar .navbar-brand,
.she-navbar .nav-link {
    color: #fff;
}

.she-navbar .nav-link:hover {
    color: #ffd8e6;
}

/* Nav: keep items in one row, evenly distributed */
.navbar-nav {
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-evenly;
}

.navbar-nav>.nav-item {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
}

.she-navbar .nav-link {
    width: 100%;
    white-space: nowrap;
    text-align: center;
    padding: clamp(.4rem, .9vw, .7rem) clamp(.5rem, 1.2vw, .9rem);
    font-size: clamp(.85rem, 1.2vw, 1rem);
    /* corrected from .8.5rem */
}

/* Highlight login button */
.btn-login {
    background: #ff6fa8;
    border: 0;
    color: #1b1b1b;
    padding: .5rem .9rem;
    border-radius: .5rem;
}

.btn-login:hover {
    filter: brightness(1.05);
}

/* Spacer equal to navbar height */
.fixed-top-spacer {
    height: 64px;
}

/* ===== Sections ===== */
/* Hero uses transparent background so body gradient is visible */
.hero {
    min-height: calc(100vh - 64px);
    background: transparent;
}

/* Content blocks should also be transparent to show gradient */
.content-block {
    background: transparent;
}

/* Text colors */
.text-dark-ink {
    color: #1f2233;
}

.text-dark-ink-60 {
    color: rgba(31, 34, 51, .65);
}

/* Hero text block */
.text-block {
  max-width: 600px;
  color: #1f2233; /* 粉色 */
  font-family: 'Georgia', serif;
}


.she-big {
  font-size: 3rem;       /* bigger than other words */
  font-weight: bold;
  color: #1f2233;
    margin-right: .3rem;
}

.she-normal {
  font-size: 1.8rem;     /* smaller than other */
  font-weight: normal;
  color: #1f2233;
}

p {
  font-size: 1.8rem;
  font-weight: normal;
  color: #1f2233;
  line-height: 1.6;
}
</style>