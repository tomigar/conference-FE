<template>
  <div class="form-page">
    <h1>Upraviť konferenciu</h1>

    <form @submit.prevent="saveConference">
      <div class="form-group">
        <label for="name">Názov konferencie</label>
        <input id="name" v-model="conference.name" required />
      </div>

      <div class="form-group">
        <label for="description">Popis</label>
        <Editor v-model="conference.description" />
      </div>

      <div class="form-group">
        <label for="location">Miesto</label>
        <input id="location" v-model="conference.location" required />
      </div>

      <div class="form-group">
        <label for="year">Rok</label>
        <input id="year" v-model.number="conference.year" type="number" required />
      </div>

      <div class="form-group">
        <label for="start_date">Začiatok</label>
        <input id="start_date" v-model="conference.start_date" type="date" required />
      </div>

      <div class="form-group">
        <label for="end_date">Koniec</label>
        <input id="end_date" v-model="conference.end_date" type="date" required />
      </div>

      <div class="form-group checkbox">
        <input type="checkbox" id="is_active" v-model="conference.is_active" />
        <label for="is_active">Konferencia je aktívna</label>
      </div>

      <div class="form-actions">
        <button type="submit">Uložiť zmeny</button>
      </div>
    </form>
    
    
    <hr class="my-6" />

<h2 class="text-xl font-semibold mt-4 mb-2">Podstránky konferencie</h2>

<ul class="pages-list">
  <li v-for="page in pages" :key="page.id" class="flex justify-between items-center border-b py-2">
    <NuxtLink :to="`/pages/${page.id}`" class="text-blue-700 hover:underline">
      {{ page.title }}
    </NuxtLink>
    <div class="flex gap-2">
      <NuxtLink :to="`/pages/${page.id}/edit`" class="text-blue-500 hover:underline text-sm">
        Upraviť
      </NuxtLink>
      <button @click="deletePage(page.id)" class="text-red-500 text-sm">
        Odstrániť
      </button>
    </div>
  </li>
</ul>

<div class="mt-4">
  <NuxtLink :to="`/conferences/${id}/pages/new`" class="btn">
    Pridať novú podstránku
  </NuxtLink>
</div>


  </div>
</template>

<script setup lang="ts">
import Editor from '~/components/Editor.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

const api = useApiCalls()
const route = useRoute()
const router = useRouter()
const pages = ref<any[]>([])


const id = Number(route.params.id)

const conference = ref<any>({
  name: '',
  description: '',
  location: '',
  year: new Date().getFullYear(),
  start_date: '',
  end_date: '',
  is_active: false
})

onMounted(async () => {
  try {
    const response = await api.conferences.get(id)
    conference.value = response.data

    const pageRes = await api.pages.list(id) // ← id konferencie
    pages.value = pageRes.data
  } catch (e) {
    alert('Nepodarilo sa načítať konferenciu.')
    router.push('/conferences')
  }
})


const deletePage = async (pageId: number) => {
  if (confirm('Naozaj chcete vymazať túto podstránku?')) {
    await api.pages.delete(pageId)
    pages.value = pages.value.filter(p => p.id !== pageId)
  }
}

const saveConference = async () => {
  try {
    await api.conferences.update(id, conference.value)
    alert('Konferencia bola úspešne aktualizovaná.')
  } catch (e) {
    alert('Chyba pri ukladaní konferencie.')
  }
}
</script>

<style scoped>
.form-page {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f7fafc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.form-group {
  margin-bottom: 1rem;
}
.form-actions {
  text-align: right;
  margin-top: 1rem;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}
</style>
