<template>
  <div class="min-h-screen bg-gray-50 py-14 px-4 font-sans text-gray-800">
    <!-- Späť na konferenciu -->
    <div class="max-w-4xl mx-auto mb-8">
      <NuxtLink
        :to="`/${conferenceId}`"
        class="inline-flex items-center text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition px-5 py-2.5 rounded-lg shadow-sm"
      >
        ← Späť na konferenciu
      </NuxtLink>
    </div>

    <!-- Obsah podstránky -->
    <div class="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10 transition-all duration-300">
      
      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-500 text-lg font-medium py-10">
        Načítavam podstránku...
      </div>

      <!-- Zobrazenie podstránky -->
      <div v-else-if="page">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 border-b border-gray-200 pb-4">
          {{ page.title }}
        </h1>

        <div
          class="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          v-html="page.content"
        />
      </div>

      <!-- Chyba -->
      <div v-else class="text-center text-red-600 font-medium py-10">
        Nepodarilo sa načítať podstránku.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'
import type { Page } from '~~/types/Page'

const route = useRoute()
const conferenceId = Number(route.params.id)
const pageId = Number(route.params.pageId)

const { pages } = useApiCalls()
const page = ref<Page | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await pages.get(conferenceId, pageId)
    page.value = response.data
  } catch (err) {
    console.error('❌ Chyba pri načítaní podstránky:', err)
    page.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style>
.prose img {
  max-width: 100%;
  height: auto;
}
</style>
