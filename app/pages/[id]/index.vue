<template>
  <div class="max-w-5xl mx-auto px-6 py-14 font-sans text-gray-800">
    <!-- Späť -->
    <div class="mb-10">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition px-6 py-3 rounded-lg shadow"
      >
        ← Späť na všetky konferencie
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20 text-gray-500 text-xl font-medium">
      Načítavam dáta...
    </div>

    <!-- Konferencia -->
    <div v-else-if="conference" class="space-y-10">
      <div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {{ conference.name }}
        </h1>
        <p class="text-lg text-gray-600 mb-1">📍 {{ conference.location }}</p>
        <p class="text-sm text-gray-500 mb-4">
          🗓️ {{ formatDate(conference.start_date) }} – {{ formatDate(conference.end_date) }}
        </p>
        <p class="text-base text-gray-700 leading-relaxed">{{ conference.description }}</p>
      </div>

      <!-- Podstránky -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Podstránky</h2>

        <div v-if="pages.length === 0" class="text-gray-400 italic">
          Žiadne podstránky neboli pridané.
        </div>

        <ul class="grid sm:grid-cols-2 gap-6">
          <li
            v-for="page in pages"
            :key="page.id"
            @click="$router.push(`/${conference.id}/subpage/${page.id}`)"
            class="group cursor-pointer border border-gray-200 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-300"
          >
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-gray-900 mb-0">
              {{ page.title }}
            </h3>
          </li>
        </ul>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center text-red-500 font-medium mt-20">
      Nepodarilo sa načítať konferenciu.
    </div>
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
