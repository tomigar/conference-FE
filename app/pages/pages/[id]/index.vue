<template>
    <div class="page-view">
      <h1>{{ page.title }}</h1>
      <div class="content" v-html="page.content" />

      <div class="edit-button-container">
      <NuxtLink :to="`/pages/${page.id}/edit`" class="edit-button">
        Upraviť podstránku
      </NuxtLink>
    </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Page } from '~~/types/Page'
  
  const route = useRoute()
  const router = useRouter()
  const api = useApiCalls()
  
  const pageId = Number(route.params.id)
  
  const page = ref<Page>({
    id: pageId,
    conference_id: 0,
    title: '',
    slug: '',
    content: '',
    created_at: '',
    updated_at: '',
  })
  
  onMounted(async () => {
    try {
      const response = await api.pages.getById(pageId)
      page.value = response.data
    } catch (e) {
      alert('Nepodarilo sa načítať podstránku.')
      router.push('/conferences')
    }
  })
  </script>
  
  <style scoped>
  .page-view {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .page-view h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .content {
    line-height: 1.7;
  }
  </style>
  