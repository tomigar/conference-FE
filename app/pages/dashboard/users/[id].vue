<template>
 <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Edit User</h1>
    <div class="flex flex-col gap-4 w-2xl">
      <UInput v-model="user.name" placeholder="Name" />
      <UInput v-model="user.email" placeholder="Email" />
      <USelect v-model="user.role" :items="['admin', 'editor']" placeholder="Role"/>
    </div>
    <div class="flex gap-4">
      <UButton variant="ghost" color="neutral" @click="$router.push('/dashboard/users')">Cancel</UButton>
      <UButton variant="solid" color="primary" @click="editUser()">Save</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'

import { useRoute } from 'vue-router'
import type { User } from '~~/types/User'


definePageMeta({
  layout: 'dashboard',
  title: 'Edit User',
  breadcrumbs: [
    { label: 'Users', icon: 'i-lucide-user-pen', to: '/dashboard/users' },
    { label: 'Edit User', icon: 'i-lucide-user-pen' },
  ]
})

const route = useRoute()
const userId =  parseInt(route.params.id as string, 10)
const user = ref<User>({
  id: '',
  name: '',
  email: '',
  role: ''
})

const editUser = async () => {
  const response = await useApiCalls().users.update(userId, user.value)
  console.log('User updated:', response)
}

onMounted(async () => {
    if (userId) {
        const response = await useApiCalls().users.get(userId)
        user.value = (response as { data: typeof user.value }).data
        console.log('User:', user.value)
        route.meta.breadcrumbs = [
            { label: 'Users', icon: 'i-lucide-user-pen', to: '/dashboard/users' },
            { label: `Edit User ${user.value.name}`, icon: 'i-lucide-user-pen' },
        ]

    }
})
</script>