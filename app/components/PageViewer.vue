<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <div class="page-content" v-html="page.content" />

    <!-- Zobrazenie priradených súborov -->
    <div class="attachments mt-6">
      <h2 class="text-lg font-semibold mb-2">Priložené súbory:</h2>
      <div v-if="files.length">
        <div
          v-for="file in files"
          :key="file.id"
          class="mb-4 border p-2 rounded bg-gray-50"
        >
          <div v-if="file.mime_type.startsWith('image/')">
            <img :src="file.url" :alt="file.name" class="max-w-xs rounded" />
          </div>
          <div v-else>
            <a :href="file.url" target="_blank" class="text-blue-600 underline">
              {{ file.name }}
            </a>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-sm text-gray-500">Žiadne priložené súbory.</p>
      </div>
    </div>
  </div>
  <div v-else class="text-red-600">Podstránka sa nenašla.</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Page } from '~~/types/Page'

const props = defineProps<{ conferenceId: number, pageId: number }>()

const page = ref<Page | null>(null)
const files = ref<any[]>([]) // môžeš nahradiť typovaním cez vlastný File typ

const fetchPage = async () => {
  try {
    // Načítaj podstránku
    const res = await $fetch<{ data: Page }>(
      `http://localhost:8000/api/conferences/${props.conferenceId}/pages/${props.pageId}`
    )
    page.value = res.data

    // Načítaj priradené súbory
    const fileRes = await $fetch<{ data: any[] }>(
      `http://localhost:8000/api/pages/${props.pageId}/files`
    )
    files.value = fileRes.data || []
  } catch (err) {
    console.error('❌ Chyba pri načítaní podstránky alebo súborov:', err)
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
.attachments img {
  margin-top: 0.5rem;
}
</style>
