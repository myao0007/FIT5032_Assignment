
<template>
  <section class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="m-0">User Profiles</h3>
      <div class="d-flex gap-2">
        <Button label="Reload" icon="pi pi-refresh" severity="secondary" @click="load" />
        <Button label="Clear all (demo)" icon="pi pi-trash" severity="danger" @click="clearAll" />
      </div>
    </div>

    <DataTable
      :value="profiles"
      dataKey="email"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5,10,20]"
      sortMode="multiple"
      removableSort
      class="shadow-sm"
      tableStyle="min-width: 40rem"
      :emptyMessage="'No profiles yet — register a user first.'"
    >
      <Column field="email" header="Email" sortable />
      <Column field="displayName" header="Display Name" sortable />
      <Column field="joinedAt" header="Joined At" sortable style="width: 12rem" />
    </DataTable>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const LS_KEY = 'user_profile'          // 数组：[{email, displayName, joinedAt}, ...]

const profiles = ref([])

function load() {
  const json = localStorage.getItem(LS_KEY)
  profiles.value = json ? JSON.parse(json) : []
}

function clearAll() {
  localStorage.removeItem(LS_KEY)
  load()
}

onMounted(load)

// <ProfileTable ref="pt" /> -> pt.load()
defineExpose({ load })
</script>

<style scoped>
/*  */
</style>