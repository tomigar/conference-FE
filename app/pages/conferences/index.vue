<template>
  <div class="conference-page">
    <h1 class="text-2xl font-bold mb-4">Konferencie</h1>

    <div class="conference-list">
      <div
        v-for="conference in conferences"
        :key="conference.id"
        class="conference-item"
      >
        <NuxtLink :to="`/conferences/${conference.id}`" class="name">
          {{ conference.name }}
        </NuxtLink>
        <div class="dates">
          {{ formatDate(conference.start_date) }} - {{ formatDate(conference.end_date) }}
        </div>
      </div>
    </div>

    <div class="mt-6">
      <NuxtLink to="/conferences/newConference" class="btn">Pridať novú konferenciu</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'
import type { Conference } from '~~/types/Conference'

const api = useApiCalls()
const conferences = ref<Conference[]>([])

onMounted(async () => {
  const response = await api.conferences.list()
  conferences.value = response.data
})

function formatDate(dateStr: string): string {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Date(dateStr).toLocaleDateString('sk-SK', options)
}
</script>

<style scoped>
.conference-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.conference-item {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}
.name {
  font-size: 1.25rem;
  color: #2563eb;
  text-decoration: none;
}
.name:hover {
  text-decoration: underline;
}
.dates {
  font-size: 0.95rem;
  color: #555;
}
.btn {
  display: inline-block;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}
.btn:hover {
  background-color: #1e40af;
}
</style>
