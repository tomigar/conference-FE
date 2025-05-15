<template>
   <div @click="() => navigateTo('dashboard')">
    aaa
  </div>


</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

  router.push('/conferences')

</script>

<style scoped>
.homepage {
  padding: 2rem;
  text-align: center;
}

.navigation {
  margin-top: 2rem;
}

.conference-link {
  display: inline-block;
  background-color: #1d4ed8;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
}

.conference-link:hover {
  background-color: #2563eb;
}
</style>
