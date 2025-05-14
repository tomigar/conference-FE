<template>
    <div class="max-w-4xl mx-auto px-6 py-10">
      <div v-if="loading" class="text-center text-blue-600">Načítavam podstránku...</div>
  
      <div v-else-if="page">
        <h1 class="text-3xl font-bold text-blue-800 mb-4">{{ page.title }}</h1>
        <div class="prose max-w-none" v-html="page.content"></div>
      </div>
  
      <div v-else class="text-red-600">Podstránka sa nenašla.</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  interface Page {
    id: number
    title: string
    content: string
  }
  
  const API = 'http://localhost:8000/api'
  const route = useRoute()
  const pageId = Number(route.params.pageId)
  
  const page = ref<Page | null>(null)
  const loading = ref(true)
  
  onMounted(async () => {
    try {
      const res = await $fetch<{ data: Page }>(`${API}/pages/${pageId}`)
      page.value = res.data
    } catch (err) {
      console.error('❌ Chyba pri načítaní podstránky:', err)
      page.value = null
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .prose {
    line-height: 1.75;
  }
  </style>
  