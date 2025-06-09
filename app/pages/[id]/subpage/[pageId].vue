<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <PageViewer :conferenceId="conferenceId" :pageId="pageId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import PageViewer from '@/components/PageViewer.vue'

const route = useRoute()
const conferenceId = Number(route.params.id)
const pageId = Number(route.params.pageId)
</script>
