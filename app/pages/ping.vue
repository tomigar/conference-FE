<script setup lang="ts">
const { data, error } = await useFetch('http://127.0.0.1:8000/api/user', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer 1|v2b8fCb9qkXGwKzUpVpaqn0tvuKN8VEebQNpFUud67dd21c6'
  }
})
</script>

<template>
  <div>
    <h1>Test spojenia s backendom</h1>
    <p v-if="error">❌ Chyba: {{ error.statusMessage }}</p>
    <pre v-if="error">{{ error }}</pre>

    <p v-if="data">✅ Úspešná odpoveď:</p>
    <pre v-if="data">{{ data }}</pre>
  </div>
</template>

