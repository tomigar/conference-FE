<template>
  <div class="max-w-4xl mx-auto px-6 py-12 font-sans">
    <h1 class="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight">📅 Konferencie</h1>

    <div v-if="loading" class="flex justify-center py-20 text-blue-500 text-xl font-medium">
      Načítavam...
    </div>

    <div v-else-if="conferences.length === 0" class="text-center text-gray-500 text-lg">
      Žiadne konferencie neboli nájdené.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="conference in conferences"
        :key="conference.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-blue-50 border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-xl px-6 py-5"
        @click="navigateTo(`/${conference.id}`)"
      >
        <!-- Názov -->
        <div class="text-xl sm:text-2xl font-semibold text-blue-900 truncate">
          {{ conference.name }}
        </div>

        <!-- Miesto -->
        <div class="text-base sm:text-lg text-gray-700 truncate text-center sm:text-left">
          {{ conference.location }}
        </div>

        <!-- Dátum -->
        <div class="text-base sm:text-lg text-gray-600 whitespace-nowrap text-center">
          {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'
import type { Conference } from '~~/types/Conference'

const api = useApiCalls()
const conferences = ref<Conference[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.conferences.list()
    conferences.value = response.data
  } catch (error) {
    console.error('Chyba pri načítaní konferencií', error)
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr: string): string {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Date(dateStr).toLocaleDateString('sk-SK', options)
}
</script>
