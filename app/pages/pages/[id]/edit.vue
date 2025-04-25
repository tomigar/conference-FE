<template>
  <div class="page-edit">
    <h1>Upraviť podstránku</h1>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Názov</label>
        <input id="title" v-model="form.title" required />
      </div>

      <div class="form-group">
        <label for="content">Obsah</label>
        <Editor v-model="form.content" />
      </div>

      <div class="form-actions">
        <button type="submit">Uložiť zmeny</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'
import Editor from '@/components/Editor.vue'

const route = useRoute()
const router = useRouter()
const api = useApiCalls()

const pageId = Number(route.params.id)

const form = ref({
  title: '',
  content: '',
})

onMounted(async () => {
  try {
    const response = await api.pages.getById(pageId)
    const pageData = response.data
    form.value.title = pageData.title
    form.value.content = pageData.content
  } catch (e) {
    alert('Nepodarilo sa načítať podstránku.')
    router.push('/conferences')
  }
})

const submitForm = async () => {
  try {
    await api.pages.updateWithoutConference(pageId, form.value)
    alert('Podstránka bola úspešne upravená.')
    router.back()
  } catch (e) {
    alert('Chyba pri ukladaní podstránky.')
  }
}
</script>

<style scoped>
.page-edit {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.05);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.form-actions {
  text-align: right;
}
.form-actions button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.form-actions button:hover {
  background-color: #1d4ed8;
}
</style>
