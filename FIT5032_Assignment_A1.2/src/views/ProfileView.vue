<template>
  <div class="auth-bg">
    <div class="profile-card">
      <h2 class="fw-bold mb-4 text-center">User Information List</h2>

      <!-- Non-admin prompt (may flash briefly) -->
      <p v-if="!isAdmin && checked" class="text-center text-muted">
        You don’t have permission to view this page.
      </p>

      <!-- Admin list -->
      <table v-else-if="users.length" class="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.username || '-' }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.dob || '-' }}</td>
            <td>{{ u.role || 'user' }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="checked" class="text-center text-muted">No user information available.</p>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/config'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
// import { signOut } from 'firebase/auth'

const router = useRouter()

const users = ref([])
const isAdmin = ref(false)
const checked = ref(false) // Permission check completed

onMounted(async () => {
  const current = auth.currentUser
  if (!current) {
    // Not logged in, redirect to login page
    router.replace('/login')
    return
  }

  try {
    // Read current user role
    const meSnap = await getDoc(doc(db, 'users', current.uid))
    const me = meSnap.exists() ? meSnap.data() : null
    isAdmin.value = me?.role === 'admin'
    checked.value = true

    if (!isAdmin.value) {
      // Not admin: redirect to home
      router.replace('/home')
      return
    }

    // Admin: fetch all users
    const snap = await getDocs(collection(db, 'users'))
    users.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    // Offline/network blocked: gentle prompt and redirect to home
    console.warn('[Profile] failed to load due to network:', e?.message || e)
    checked.value = true
    router.replace('/home')
  }
})

// Removed Sign out button from this page, using top-right global Logout
</script>

<style scoped>
.auth-bg {
  --nav-h: 64px;
  min-height: calc(100vh - var(--nav-h));
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 24px 24px;
  background: white;
  color: #262c67;
}

.profile-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: 32px 28px;
  margin-top: 64px;
  overflow-x: auto;
}

.profile-card h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 18px;
  text-align: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th,
.table td {
  padding: 10px 14px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 0.95rem;
}

.table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* Reuse your button style class names */
.btn-primary-custom {
  display: inline-block;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #151a4b;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primary-custom:hover {
  filter: brightness(1.08);
}

@media (max-width: 480px) {
  .profile-card {
    padding: 20px 16px;
    border-radius: 14px;
  }

  .table th,
  .table td {
    padding: 8px;
    font-size: 0.85rem;
  }
}
</style>
