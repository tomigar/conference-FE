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
          <textarea id="description" v-model="conference.description"></textarea>
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
        <li v-for="page in pages" :key="page.id">
          <NuxtLink :to="`/pages/${page.id}/edit`" class="text-blue-600 underline">
            {{ page.title }}
          </NuxtLink>
          <button @click="removePage(page.id)" class="text-red-500 text-sm ml-2">Vymazať</button>
        </li>
      </ul>
  
      <form @submit.prevent="addPage" class="mt-4 space-y-2">
        <input v-model="newPageTitle" placeholder="Názov novej podstránky" class="input" />
        <button class="btn" type="submit">Pridať podstránku</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useApiCalls } from '~~/composables/useApiCalls'
  
  const api = useApiCalls()
  const route = useRoute()
  const router = useRouter()
  
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
  
  const pages = ref<any[]>([])
  const newPageTitle = ref('')
  
  onMounted(async () => {
    const response = await api.conferences.get(id)
    conference.value = response.data
  
    const pageResponse = await api.pages.list(id)
    pages.value = pageResponse.data
  })
  
  const saveConference = async () => {
    await api.conferences.update(id, conference.value)
    alert('Zmeny boli uložené.')
  }
  
  const addPage = async () => {
    if (newPageTitle.value.trim()) {
      const res = await api.pages.create(id, { title: newPageTitle.value })
      pages.value.push(res.data)
      newPageTitle.value = ''
    }
  }
  
  const removePage = async (pageId: number) => {
    if (confirm('Naozaj chcete vymazať túto podstránku?')) {
      await api.pages.delete(id, pageId)
      pages.value = pages.value.filter(p => p.id !== pageId)
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
  .pages-list {
    list-style: none;
    padding: 0;
  }
  .pages-list li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }
  .input {
    display: block;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
  .btn {
    padding: 0.5rem 1rem;
    background: #3490dc;
    color: white;
    border: none;
    border-radius: 0.25rem;
  }
  </style>
  