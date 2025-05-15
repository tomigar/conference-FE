<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Add Editors</h1>
        <h2 class="text-xl font-bold">Assigned Editors</h2>
        <div v-if="!assignedEditors.length">
            <LoadingSpinner not-loaded-text="No assigned editors" />
        </div>
        <div v-else class="flex gap-4">
            <div v-for="editor in assignedEditors"  :key="editor.id">
                <div class="p-4 flex gap-4 bg-gray-100 dark:bg-slate-10 text-left text-gray-700">
                    {{ editor.name }}
                    <UButton
                        icon="i-lucide-trash-2"
                        variant="ghost"
                        color="neutral"
                        @click="unassignEditor(editor.id)"
                    />
                </div>
            </div>
        </div>

        <h2 class="text-xl font-bold">Available Editors</h2>
        <LoadingSpinner v-if="!availableEditors.length" not-loaded-text="No available editors" />
        <div class="flex gap-4">
            <div v-for="e in availableEditors" :key="e.id">
                <div class="p-4 bg-gray-100 dark:bg-slate-10 text-left text-gray-700 flex align-center">
                    <span>{{ e.name }}</span>
                    <UButton
                    icon="i-lucide-plus"
                    variant="ghost"
                    color="neutral"
                    @click="selectEditor(e.id)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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
const conferenceId =  parseInt(route.params.id as string, 10)

const availableEditors = ref<{ id: number; name: string }[]>([])

const assignedEditors = ref<{ id: number; name: string }[]>([])

const selectEditor = async (editorId: number) => {
    try {
        await useApiCalls().editors.assign(conferenceId, editorId)
        const responseEditors = await useApiCalls().editors.list(conferenceId);
        assignedEditors.value = (responseEditors as { data: typeof assignedEditors.value }).data
        console.log('Editors:', assignedEditors.value)
        availableEditors.value = availableEditors.value.filter((e) => e.id !== editorId)
    } catch (error) {
        console.error('Failed to assign editor:', error)
    }
}

const unassignEditor = async (editorId: number) => {
    const editor = assignedEditors.value.find(e => e.id === editorId)
    try {
        await useApiCalls().editors.unassign(conferenceId, editorId)
        const responseEditors = await useApiCalls().editors.list(conferenceId);
        assignedEditors.value = (responseEditors as { data: typeof assignedEditors.value }).data
        console.log('Editors:', assignedEditors.value)
        availableEditors.value.push(editor as { id: number; name: string })
    } catch (error) {
        console.error('Failed to unassign editor:', error)
    }
}

onMounted(async () => {
    if (conferenceId) {
        route.meta.breadcrumbs = [
            { label: 'Conferences', icon: 'i-lucide-calendar-clock', to: '/dashboard/conferences' },
            { label: 'Edit Conference', icon: 'i-lucide-edit', to: `/dashboard/conferences/${conferenceId}` },
            { label: 'Editors', icon: 'i-lucide-edit' },
        ]
        const responseEditors = await useApiCalls().editors.list(conferenceId);
        assignedEditors.value = (responseEditors as { data: typeof assignedEditors.value }).data
        console.log('Editors:', assignedEditors.value)

        const responseAvailableEditors = await useApiCalls().editors.available(conferenceId);
        availableEditors.value = (responseAvailableEditors as { data: typeof availableEditors.value }).data
    }
})
</script>
