<template>
    <div class="conference-page">
      <section class="hero">
        <div class="overlay">
          <h1>Správa konferencií</h1>
        </div>
      </section>
  
      <section class="content">
        <div class="header">
          <h2>Zoznam konferencií</h2>
          <p>Spravujte všetky konferencie z tohto rozhrania.</p>
        </div>
  
        <div class="conference-grid">
          <div
            v-for="conference in conferences"
            :key="conference.id"
            class="conference-card"
          >
            <h3>{{ conference.name }}</h3>
            <p>{{ conference.description }}</p>
            <small>
              {{ formatDate(conference.start_date) }} -
              {{ formatDate(conference.end_date) }}<br />
              Miesto: {{ conference.location }}
            </small>
            <div class="actions">
              <nuxt-link :to="`/conferences/${conference.id}/edit`">Upraviť</nuxt-link>
              <button v-if="conference.id" @click="deleteConference(conference.id)">
                Odstrániť
              </button>
            </div>
          </div>
        </div>
  
        <div class="add-button">
          <nuxt-link to="/conferences/newConference">Pridať novú konferenciu</nuxt-link>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useApiCalls } from '~~/composables/useApiCalls'
  import type { Conference } from '~~/types/Conference'
  
  const api = useApiCalls()
  const conferences = ref<Conference[]>([])
  
  onMounted(async () => {
    const response = await api.conferences.list()
    console.log('API RESPONSE:', response)
    conferences.value = response.data
  })
  
  function formatDate(dateStr: string): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return new Date(dateStr).toLocaleDateString('sk-SK', options)
  }
  
  async function deleteConference(id: number) {
    if (confirm('Naozaj chcete odstrániť túto konferenciu?')) {
      await api.conferences.delete(id)
      conferences.value = conferences.value.filter(conf => conf.id !== id)
    }
  }
  </script>
  
  <style scoped src="@/assets/css/conference.css"></style>
  