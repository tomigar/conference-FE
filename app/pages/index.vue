<template>
  <div class="max-w-5xl mx-auto px-6 py-14 font-sans text-gray-800">
    <h1
      class="text-5xl font-extrabold mb-12 text-center text-gray-900 tracking-tight transition-all duration-300"
    >
      🎓 Prehľad konferencií
    </h1>

    <div v-if="loading" class="flex justify-center py-20 text-gray-500 text-xl font-medium">
      Načítavam...
    </div>

    <div v-else-if="conferences.length === 0" class="text-center text-gray-500 text-lg">
      Žiadne konferencie neboli nájdené.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="conference in conferences"
        :key="conference.id"
        @click="navigateTo(`/${conference.id}`)"
        class="group cursor-pointer border border-gray-200 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-300"
      >
        <h2 class="text-2xl font-semibold text-gray-800 group-hover:text-gray-900 mb-2">
          {{ conference.name }}
        </h2>
        <p class="text-gray-600 mb-1">
          📍 {{ conference.location }}
        </p>
        <p class="text-sm text-gray-500">
          🗓️ {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}
        </p>
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
