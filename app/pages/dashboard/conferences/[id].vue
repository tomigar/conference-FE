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
    <h1 class="text-2xl font-bold">Subpages</h1>
    <div v-for="subpage in subpages" :key="subpage.id">
        {{ subpage.title }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

const router = useRouter()

definePageMeta({
    layout: 'dashboard',
    title: 'Create Conference',
    breadcrumbs: [
        { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
        { label: 'Edit Conference', icon: 'i-lucide-edit' },
    ]
})

const route = useRoute()
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

const subpages = ref([])

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
        console.log(await useApiCalls().pages.get(1, 1))
    }
})
</script>
