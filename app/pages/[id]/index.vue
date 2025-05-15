<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div v-if="loading" class="text-center text-blue-600">Načítavam dáta...</div>

    <div v-else-if="conference">
      <!-- Konferencia -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-blue-800 mb-2">{{ conference.name }}</h1>
        <p class="text-gray-700">📍 {{ conference.location }}</p>
        <p class="text-gray-600 mb-4">
          🗓️ {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}
        </p>
        <p class="text-gray-800">{{ conference.description }}</p>
      </div>

      <!-- Podstránky -->
      <div>
        <h2 class="text-2xl font-semibold text-blue-700 mb-4">Podstránky</h2>
        <div v-if="pages.length === 0" class="text-gray-500">Žiadne podstránky.</div>

        <ul class="space-y-4">
  <li
    v-for="page in pages"
    :key="page.id"
    class="p-4 border border-gray-200 rounded shadow-sm hover:bg-gray-50"
  >
    <h3 class="text-xl font-medium text-blue-600">{{ page.title }}</h3>
    <p class="text-sm text-gray-500 truncate">{{ page.content }}</p>
    <NuxtLink
      :to="`/${conference.id}/subpage/${page.id}`"
      class="text-sm text-blue-500 hover:underline mt-1 inline-block"
    >
      Zobraziť podstránku →
    </NuxtLink>
  </li>
</ul>

      </div>
    </div>

    <div v-else class="text-red-500">Nepodarilo sa načítať konferenciu.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Conference {
  id: number
  name: string
  location: string
  start_date: string
  end_date: string
  description: string
}

interface Page {
  id: number
  title: string
  content: string
}

const route = useRoute()
const id = Number(route.params.id)
const API = 'http://localhost:8000/api'

const conference = ref<Conference | null>(null)
const pages = ref<Page[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const confRes = await $fetch<{ data: Conference }>(`${API}/conferences/${id}`)
    conference.value = confRes.data

    const pageRes = await $fetch<{ data: Page[] }>(`${API}/conferences/${id}/pages`)
    pages.value = pageRes.data
  } catch (err) {
    console.error('Chyba pri načítaní:', err)
    conference.value = null
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr: string): string {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Date(dateStr).toLocaleDateString('sk-SK', options)
}
</script>
