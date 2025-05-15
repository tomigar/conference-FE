<template>
    <ClientOnly>
        <h1 class="text-2xl font-bold">Edit Subpage</h1>
        <div class="flex flex-col gap-4 w-full">
            <UInput v-model="subpage.title" placeholder="Name" required />
            <UInput v-model="subpage.slug" placeholder="Slug" required />
            <TiptapEditor v-model="editorContent"/>
        </div>
        <div class="flex gap-4 justify-end mt-2">
            <UButton variant="ghost" color="neutral" @click="$router.push('/dashboard/conferences')">Cancel</UButton>
            <UButton variant="solid" color="primary" @click="editSubpage()">Save</UButton>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

definePageMeta({
    layout: 'dashboard',
    title: 'subpage',
    breadcrumbs: [
        { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
        { label: 'Edit Conference', icon: 'i-lucide-edit' },
        { label: 'Edit Subpage', icon: 'i-lucide-edit' },
    ]
})
const subpage = ref({
    title: '',
    slug: '',
    content: '',
})
const editorContent = ref('')

const apiCalls = useApiCalls()


const route = useRoute()
// const router = useRouter()
const conferenceId =  parseInt(route.params.id as string, 10)
const subpageId =  parseInt(route.params.subpageId as string, 10)

const editSubpage = async () => {
    const response = await useApiCalls().pages.update(conferenceId, subpageId, {
        title: subpage.value.title,
        slug: subpage.value.slug,
        content: editorContent.value,
    })
    if (response) {
        console.log('Subpage updated successfully:', response)
        // Redirect or show success message
    } else {
        console.error('Failed to update subpage')
    }
}

onMounted(async () => {
    if (conferenceId) {
        const response = await apiCalls.pages.get(conferenceId, subpageId)
        subpage.value = (response as { data: typeof subpage.value }).data
        editorContent.value = subpage.value.content
        route.meta.breadcrumbs = [
            { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
            { label: 'Edit Conference', icon: 'i-lucide-edit', to: `/dashboard/conferences/${conferenceId}` },
            { label: subpage.value.title, icon: 'i-lucide-edit', to: `/dashboard/conferences/${conferenceId}/subpage/${subpageId}` },
        ]
    }
})

</script>

<style scoped>


</style>