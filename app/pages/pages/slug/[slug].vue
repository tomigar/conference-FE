<template>
    <div class="page-view">
      <h1 class="title">{{ page.title }}</h1>
      <div class="content" v-html="page.content" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Page } from '~~/types/Page'
  
  const route = useRoute()
  const router = useRouter()
  const slug = route.params.slug as string
  const api = useApiCalls()
  
  const page = ref<Page>({
    id: 0,
    title: '',
    slug: '',
    content: '',
    conference_id: 0,
    created_at: '',
    updated_at: ''
  })
  
  onMounted(async () => {
    try {
      const response = await api.pages.getBySlug(slug)
      page.value = response.data
    } catch (e) {
      alert('Podstránka sa nenašla.')
      router.push('/')
    }
  })
  </script>
  
  <style scoped>
  .page-view {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f9fafb;
    border-radius: 8px;
  }
  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .content {
    font-size: 1rem;
    line-height: 1.6;
  }
  </style>
  