<template>
    <div class="conference-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <NuxtLink :to="`/conferences/${conference.id}`" class="conference-title">
            <h2>{{ conference.name }}</h2>
        </NuxtLink>
        <ul>
            <li v-for="page in filteredPages" :key="page.id">
            <NuxtLink :to="`/conferences/${conference.id}?page=${page.id}`">
                {{ page.title }}
            </NuxtLink>
            </li>
        </ul>
        </aside>

  
      <!-- Explicitné renderovanie komponentov -->
      <main class="content">
        <ConferenceOverview
          v-if="!selectedPageId && conference.name"
          :conference="conference"
        />
        <PageViewer
          v-else-if="selectedPageId"
          :page-id="selectedPageId"
        />
        <div v-else>Načítavam dáta...</div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Conference } from '~~/types/Conference'
  import type { Page } from '~~/types/Page'
  
  const route = useRoute()
  const id = Number(route.params.id)
  const api = useApiCalls()
  
  const conference = ref<Conference>({
    id,
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    is_active: true,
    year: new Date().getFullYear()
  })
  
  const pages = ref<Page[]>([])
  const selectedPageId = ref<number | null>(route.query.page ? Number(route.query.page) : null)
  
  const filteredPages = computed(() =>
    pages.value.filter(p => p.conference_id === conference.value.id)
  )
  
  watch(() => route.query.page, (newVal) => {
    selectedPageId.value = newVal ? Number(newVal) : null
  })
  
  onMounted(async () => {
    const response = await api.conferences.get(id)
    conference.value = response.data
  
    const pageRes = await api.pages.list(id)
    pages.value = pageRes.data
  })
  </script>

<style scoped>
.conference-layout {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
}
.sidebar {
  width: 250px;
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
}
.sidebar h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1f2937;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 0.5rem;
}
.sidebar a {
  text-decoration: none;
  color: #2563eb;
}
.sidebar a:hover {
  text-decoration: underline;
}
.content {
  flex: 1;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
}
.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
}
.edit-btn {
  background-color: #2563eb;
  color: white;
  text-decoration: none;
}
.edit-btn:hover {
  background-color: #1e40af;
}
.delete-btn {
  background-color: #dc2626;
  color: white;
  border: none;
  cursor: pointer;
}
.delete-btn:hover {
  background-color: #b91c1c;
}
</style>

  