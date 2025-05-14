<template>
  <div class="p-4 w-full">
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
        class="w-48"
        @click="$router.push('/dashboard/conferences/create')"
      >
        Add Conference
      </UButton>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-slate-100 border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-gray-100 dark:bg-slate-10 text-left text-gray-700">
          <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Place</th>
            <th class="px-4 py-2">Year</th>
            <th class="px-4 py-2">Location</th>
            <th class="px-4 py-2">Active</th>
            <th class="px-4 py-2"/>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="conference in filteredConferences"
            :key="conference.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ conference.name }}</td>
            <td class="px-4 py-2">{{ conference.location }}</td>
            <td class="px-4 py-2">{{ conference.year }}</td>
            <td class="px-4 py-2">{{ conference.location }}</td>
            <td class="px-4 py-2">
                 <UIcon v-if="conference.is_active" name="i-lucide-check" class="size-5 text-emerald-500" />
                 <UIcon v-else name="i-lucide-x" class="size-5 text-red-500" />
            </td>
            <td class="px-4 py-2">
                <div class="flex gap-2">
                  <UButton icon='i-lucide-edit' variant='ghost' color='neutral' @click="$router.push(`/dashboard/conferences/${conference.id}`)"/>
                  <UButton icon='i-lucide-trash-2' variant='ghost' color='neutral' @click="deleteConference(conference.id)"/>
                </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="filteredConferences.length === 0" class="text-center mt-4 text-gray-500">
        No conferences found.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApiCalls } from '~~/composables/useApiCalls'

definePageMeta({
  layout: 'dashboard',
  title: 'Conferences',
})
const conferences = ref([])
// Props or data fetched from backend
onMounted(async () => {
  const response = await useApiCalls().conferences.list()
  conferences.value = response.data
    console.log('Users:', conferences.value)
})

const search = ref('')

const deleteConference = async (id) => {
  try {
    await useApiCalls().conferences.delete(id)
    conferences.value = conferences.value.filter(conference => conference.id !== id)
  } catch (error) {
    console.error('Error deleting conference:', error)
  }
}

const filteredConferences = computed(() => {
  const s = search.value.toLowerCase()
  return conferences.value.filter(user =>
    user.name.toLowerCase().includes(s) ||
    user.place.toLowerCase().includes(s) ||
    user.year.toLowerCase().includes(s)
  )
})
</script>