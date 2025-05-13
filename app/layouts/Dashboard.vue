<template>
    <div class="flex">
        <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48" />
        <header>
            <h1>Conference dashboard</h1>
        </header>
        <main class="max-w-6xl mx-auto">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Links',
      type: 'label'
    },
    {
      label: 'Conferences',
      icon: 'i-lucide-book-open',
      to: '/dashboard',
    //   children: [
    //     {
    //       label: 'Introducction',
    //       description: 'Fully styled and customizable components for Nuxt.',
    //       icon: 'i-lucide-house',
    //     },
    //   ]
    },
  ],
  [
    {
      label: 'Editors',
      icon: 'i-lucide-user-pen',
      to: '/dashboard/editors',
    },
  ],
])
</script>
