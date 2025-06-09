<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <div class="page-content" v-html="page.content" />
    <div class="actions">
     
    </div>
  </div>
  <div v-else class="text-red-600">Podstránka sa nenašla.</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'
import type { Page } from '~~/types/Page'

const props = defineProps<{ conferenceId: number, pageId: number }>()
const api = useApiCalls()

const page = ref<Page | null>(null)

const fetchPage = async () => {
  try {
    const res = await $fetch<{ data: Page }>(`http://localhost:8000/api/conferences/${props.conferenceId}/pages/${props.pageId}`)
    page.value = res.data
  } catch (err) {
    console.error('❌ Chyba pri načítaní podstránky:', err)
    page.value = null
  }
}

watch(() => [props.conferenceId, props.pageId], fetchPage, { immediate: true })
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
