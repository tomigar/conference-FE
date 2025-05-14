<template>
 <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Add User</h1>
    <div class="flex flex-col gap-4 w-2xl">
      <UInput v-model="user.name" placeholder="Name" />
      <UInput v-model="user.email" placeholder="Email" />
      <UInput v-model="user.password" placeholder="Password" type="password" />
      <UInput v-model="user.c_password" placeholder="Password check" type="password" />
      <USelect v-model="user.role" :items="['admin', 'editor']" placeholder="Role"/>
    </div>
    <div class="flex gap-4">
      <UButton variant="ghost" color="neutral" @click="$router.push('/dashboard/users')">Cancel</UButton>
      <UButton variant="solid" color="primary" @click="createUser()">Save</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'

import type { User } from '~~/types/User'

import { useRouter } from 'vue-router'
const router = useRouter()


definePageMeta({
  layout: 'dashboard',
  title: 'Edit User',
  breadcrumbs: [
    { label: 'Users', icon: 'i-lucide-user-pen', to: '/dashboard/users' },
    { label: 'Create User', icon: 'i-lucide-user-pen' },
  ]
})

const user = ref<User>({
  id: '',
  name: '',
  email: '',
  role: '',
  password: '',
  c_password: '',
})

const createUser = async () => {
    try {
        const response = await useApiCalls().auth.register(user.value) as { data: { id: string } }
        console.log('User created:', response)
        await router.push('/dashboard/users/'+ response.data.id)
    } catch (error) {
        console.error('Error creating user:', error)
    }
}


</script>