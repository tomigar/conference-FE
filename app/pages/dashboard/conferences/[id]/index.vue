<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Add Conference</h1>

    <div class="flex flex-col gap-4 w-full">
      <UInput v-model="conference.name" placeholder="Name" required />
      <UInput v-model="conference.year" placeholder="Year" type="number" required />
      <UInput v-model="conference.location" placeholder="Location" />
      <UInput v-model="conference.start_date" placeholder="Start Date" type="date" required />
      <UInput v-model="conference.end_date" placeholder="End Date" type="date" required/>
      <UTextarea v-model="conference.description" placeholder="Description" required/>
      <USelect
        v-model="conference.is_active"
        :items="selctActiveItems"
        placeholder="Status"
        />
    </div>
    <div class="flex gap-4 justify-end">
      <UButton variant="ghost" color="neutral" @click="$router.push('/dashboard/conferences')">Cancel</UButton>
      <UButton variant="solid" color="primary" @click="createConference">Save</UButton>
    </div>
    <div class="flex gap-4 justify-between">
    <h1 class="text-2xl font-bold">Subpages</h1>
      <UButton variant="solid" color="primary" @click="$router.push(`/dashboard/conferences/${conferenceId}/subpage/create`)">Add Subpage</UButton>
    </div>
    <div v-for="subpage in subpages" :key="subpage.id">
        <div class="p-4 bg-gray-100 dark:bg-slate-10 text-left text-gray-700" @click="$router.push(`/dashboard/conferences/${conferenceId}/subpage/${subpage.id}`)">
            {{ subpage.title }}
            <UButton icon='i-lucide-edit' variant='ghost' color='neutral' @click="$router.push(`/dashboard/conferences/${conferenceId}/subpages/${subpage.id}`)"/>
            <UButton icon='i-lucide-trash-2' variant='ghost' color='neutral' @click="deletePage(subpage.id)"/>

        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

definePageMeta({
    layout: 'dashboard',
    title: 'Create Conference',
    breadcrumbs: [
        { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
        { label: 'Edit Conference', icon: 'i-lucide-edit' },
    ]
})

const route = useRoute()
const router = useRouter()
const conferenceId =  parseInt(route.params.id as string, 10)
const conference = ref({
    name: '',
    year: new Date().getFullYear(),
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    is_active: 1,
})

interface Subpage {
    id: number
    title: string
    // add other properties if needed
}
const subpages = ref<Subpage[]>([])

const selctActiveItems = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]

const createConference = async () => {
    if (!conference.value.name || !conference.value.year || !conference.value.location) {
        alert('Please fill in all required fields.')
        return
    }
    try {
        const response = await useApiCalls().conferences.update(conferenceId, conference.value)
        console.log('Conference created:', response)
        await router.push('/dashboard/conferences')
    } catch (error) {
        console.error('Error creating conference:', error)
    }
}

const deletePage = async (id: number) => {
    try {
        await useApiCalls().pages.delete(conferenceId, id)
        subpages.value = subpages.value.filter(subpage => subpage.id !== id)
    } catch (error) {
        console.error('Error deleting page:', error)
    }
}

onMounted(async () => {
    if (conferenceId) {
        const response = await useApiCalls().conferences.get(conferenceId)
        conference.value = (response as { data: typeof conference.value }).data
        conference.value.is_active = conference.value.is_active ? 1 : 0
        console.log('User:', conference.value)
        route.meta.breadcrumbs = [
            { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
            { label: 'Edit Conference' + conference.value.name, icon: 'i-lucide-edit' },
        ]
        const subpagesResponse = await useApiCalls().pages.list(conferenceId)
        subpages.value = (subpagesResponse as { data: typeof subpages.value }).data
        console.log('Subpages:', subpages.value)
    }
})
</script>
