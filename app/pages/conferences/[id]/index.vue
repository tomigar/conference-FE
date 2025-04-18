<template>
    <div class="conference-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2>{{ conference.name }}</h2>
        <ul>
          <li v-for="page in filteredPages" :key="page.id">
            <NuxtLink :to="`/pages/${page.id}`">{{ page.title }}</NuxtLink>
          </li>
        </ul>
      </aside>
  
      <!-- Main content -->
      <main class="content">
        <h1>{{ conference.name }}</h1>
        <p><strong>Miesto:</strong> {{ conference.location }}</p>
        <p><strong>Dátum:</strong> {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}</p>
        <p><strong>Popis:</strong> {{ conference.description }}</p>
  
        <div class="actions">
          <NuxtLink :to="`/conferences/${conference.id}/edit`" class="edit-btn">Upraviť konferenciu</NuxtLink>
          <button @click="deleteConference" class="delete-btn">Vymazať konferenciu</button>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Conference } from '~~/types/Conference'
  import type { Page } from '~~/types/Page'
  
  const route = useRoute()
  const router = useRouter()
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
  
  const filteredPages = computed(() =>
    pages.value.filter(p => p.conference_id === conference.value.id)
  )
  
  onMounted(async () => {
    const response = await api.conferences.get(id)
    conference.value = response.data
  
    const pageRes = await api.pages.list(id)
    pages.value = pageRes.data
  })
  
  function formatDate(dateStr: string): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return new Date(dateStr).toLocaleDateString('sk-SK', options)
  }
  
  async function deleteConference() {
    if (confirm('Naozaj chcete odstrániť túto konferenciu?')) {
      await api.conferences.delete(id)
      alert('Konferencia bola odstránená.')
      router.push('/conferences')
    }
  }
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
  