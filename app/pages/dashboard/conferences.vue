<template>
  <div class="form-page w-[1200px]">
    <h1>Pridať novú konferenciu</h1>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Názov konferencie</label>
        <input id="name" v-model="form.name" required >
      </div>

      <div class="form-group">
        <label for="description">Popis</label>
        <textarea id="description" v-model="form.description"/>
      </div>

      <div class="form-group">
        <label for="location">Miesto</label>
        <input id="location" v-model="form.location" required >
      </div>

      <div class="form-group">
        <label for="year">Rok</label>
        <input id="year" v-model.number="form.year" type="number" required >
      </div>

      <div class="form-group">
        <label for="start_date">Dátum začiatku</label>
        <input id="start_date" v-model="form.start_date" type="date" required >
      </div>

      <div class="form-group">
        <label for="end_date">Dátum konca</label>
        <input id="end_date" v-model="form.end_date" type="date" required >
      </div>

      <div class="form-group checkbox">
        <input id="is_active" v-model="form.is_active" type="checkbox" >
        <label for="is_active">Konferencia je aktívna</label>
      </div>

      <div class="form-actions">
        <button type="submit">Vytvoriť</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

const api = useApiCalls()
const router = useRouter()
definePageMeta({
    layout: 'dashboard',
    title: 'Admin Dashboard',
})

const form = ref({
  name: '',
  description: '',
  location: '',
  year: new Date().getFullYear(),
  start_date: '',
  end_date: '',
  is_active: true
})

const submitForm = async () => {
  await api.conferences.create(form.value)
  router.push('/conferences')
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

.form-page h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  text-align: right;
  margin-top: 1rem;
}

.form-actions button {
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.form-actions button:hover {
  background-color: #2b6cb0;
}
</style>