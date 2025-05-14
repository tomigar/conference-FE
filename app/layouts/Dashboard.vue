<template>
  <div>
    <header>
        <h1 class="text-center ">Conference dashboard</h1>
    </header>
      <div class="flex">
          <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48" />
          <main class="max-w-6xl mx-auto">
              <slot />
          </main>
      </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Conferences',
      icon: 'i-lucide-book-open',
      to: '/dashboard/conferences',
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
