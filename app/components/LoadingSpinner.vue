<template>
    <div v-if="loading" id="spinner-container" class="space-y-10">
            <div class="flex justify-center">
                <div
                    class="w-8 h-8 border-4 border-emerald-500 border-solid border-t-transparent rounded-full animate-spin"
                />
            </div>
        </div>
        <div v-else class="flex justify-center">
            <p class="text-gray-500 text-lg font-semibold">{{ notLoadedText }}</p>
        </div>
</template>
<script setup lang="ts">
defineProps({
    notLoadedText: {
        type: String,
        default: 'Nothing to show'
    }
})
const loading = ref(true)
setTimeout(() => {
    loading.value = false
}, 3000)
</script>