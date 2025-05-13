<template>
    <div>
      <h1>{{ conference.name }}</h1>
      <p><strong>Miesto:</strong> {{ conference.location }}</p>
      <p><strong>Dátum:</strong> {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}</p>
      <p><strong>Popis:</strong> {{ conference.description }}</p>
  
      <div class="actions">
        <NuxtLink :to="`/conferences/${conference.id}/edit`" class="btn-edit">
          Upraviť konferenciu
        </NuxtLink>
        <button @click="deleteConference" class="btn-delete">
          Vymazať konferenciu
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Conference } from '~~/types/Conference'
  

  
  const props = defineProps<{ conference: Conference }>()
  const api = useApiCalls()
  const router = useRouter()
  console.log('🏷️ conference:', props.conference)

  
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('sk-SK')
  }
  
  async function deleteConference() {
    if (confirm('Naozaj chcete vymazať túto konferenciu?')) {
      await api.conferences.delete(props.conference.id)
      router.push('/conferences')
    }
  }
  </script>
  
  <style scoped>
  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }
  .btn-edit {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
  }
  .btn-edit:hover {
    background-color: #1d4ed8;
  }
  .btn-delete {
    background-color: #dc2626;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
  }
  .btn-delete:hover {
    background-color: #b91c1c;
  }
  </style>
  