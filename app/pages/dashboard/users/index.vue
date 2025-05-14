<template>
  <div class="p-4">
    <div class="mb-4 flex gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, email, or role..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <UButton
        icon="i-lucide-plus"
        variant="solid"
        color="primary"
        class="w-32"
        @click="$router.push('/dashboard/users/create')"
      >
        Add User
      </UButton>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-slate-100 border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-gray-100 dark:bg-slate-10 text-left text-gray-700">
          <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Role</th>
            <th class="px-4 py-2">Created At</th>
            <th class="px-4 py-2">Updated At</th>
            <th class="px-4 py-2"/>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.role }}</td>
            <td class="px-4 py-2">{{ user.created_at }}</td>
            <td class="px-4 py-2">{{ user.updated_at }}</td>
            <td class="px-4 py-2">
                <div class="flex gap-2">
                  <UButton icon='i-lucide-edit' variant='ghost' color='neutral' @click="$router.push(`/dashboard/users/${user.id}`)"/>
                  <UButton icon='i-lucide-trash-2' variant='ghost' color='neutral' @click="deleteUser(user.id)"/>
                </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="filteredUsers.length === 0" class="text-center mt-4 text-gray-500">
        No users found.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'

definePageMeta({
  layout: 'dashboard',
  title: 'Users',
})
const users = ref([])
// Props or data fetched from backend
onMounted(async () => {
  const response = await useApiCalls().users.list()
  users.value = response.data
    console.log('Users:', users.value)
})

const search = ref('')

const deleteUser = async (userId) => {
  try {
    await useApiCalls().users.delete(userId)
    users.value = users.value.filter(user => user.id !== userId)
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const filteredUsers = computed(() => {
  const s = search.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(s) ||
    user.email.toLowerCase().includes(s) ||
    user.role.toLowerCase().includes(s)
  )
})
</script>