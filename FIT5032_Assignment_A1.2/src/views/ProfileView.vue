<template>
  <div class="auth-bg">
    <div class="profile-card">
      <h2 class="fw-bold mb-4 text-center">User Information List</h2>


      <table v-if="users.length" class="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) in users" :key="i">
            <td>{{ u.username }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.password }}</td>

          </tr>
        </tbody>
      </table>

  
      <p v-else class="text-center text-muted">No user information available.</p>

 
      <div class="profile-actions">
        <button class="btn-primary-custom" @click="clearAll">Clear All</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'user_profiles'
const users = ref([])

onMounted(() => {
  users.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
})

function clearAll() {
  localStorage.removeItem(STORAGE_KEY)
  users.value = []
}
</script>

<style scoped>

.auth-bg {
  --nav-h: 64px;
  min-height: calc(100vh - var(--nav-h));
  display: flex;
  justify-content: center;   
  align-items: flex-start;   
  padding: 32px 24px 24px;   
  background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}


.profile-card {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: 32px 28px;
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


.btn-clear {
  display: inline-block;
  margin-top: 18px;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #151a4b;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease;
}
.btn-clear:hover {
  filter: brightness(1.1);
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


.profile-actions {
  display: flex;
  justify-content: flex-end; 
  margin-top: 16px;
}


.btn-clear {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #151a4b;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease;
}
.btn-clear:hover { filter: brightness(1.1); }
</style>