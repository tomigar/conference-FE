<template>
    <div v-if="page">
      <h1>{{ page.title }}</h1>
      <div class="page-content" v-html="page.content" />
      <div class="actions">
        <NuxtLink :to="`/pages/${page.id}/edit`" class="btn-edit">Upraviť podstránku</NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Page } from '~~/types/Page'
  
  const props = defineProps<{ pageId: number | null }>()
  const api = useApiCalls()
  
  const page = ref<Page | null>(null)
  
  const fetchPage = async () => {
    if (props.pageId) {
      const res = await api.pages.getById(props.pageId)
      page.value = res.data
    }
  }
  
  watch(() => props.pageId, fetchPage, { immediate: true })
  </script>
  
  <style scoped>
  .page-content {
    margin-top: 1rem;
    line-height: 1.7;
  }
  .actions {
    margin-top: 2rem;
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
  </style>
  