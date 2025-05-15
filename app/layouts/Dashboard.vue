<template>
  <div>
    <header class="flex items-center justify-between p-4 bg-gray-200 dark:bg-neutral-900">
      <h1 class="text-center">Dashboard</h1>
      <UBreadcrumb separator-icon="i-lucide-arrow-right" :items="breadcrumbs" />
      <ClientOnly v-if="!colorMode?.forced">
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          @click="isDark = !isDark"
        />

        <template #fallback>
          <div class="size-8" />
        </template>
        <UButton
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          @click="logout()"
        />
      </ClientOnly>
    </header>
      <div class="flex p-2">
        <ClientOnly>
          <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48" />
          <main class="max-w-6xl px-8 w-full">
              <slot />
          </main>
        </ClientOnly>
      </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, BreadcrumbItem  } from '@nuxt/ui'
import { useRoute } from 'vue-router'
import { useApiCalls } from '~~/composables/useApiCalls'

const route = useRoute()

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const items = ref<NavigationMenuItem[][]>(
[
  [
    {
      label: 'Conferences',
      icon: 'i-lucide-book-open',
      to: '/dashboard/conferences',
      // children: [
      //   {
      //     label: 'Introducction',
      //     description: 'Fully styled and customizable components for Nuxt.',
      //     icon: 'i-lucide-house',
      //   },
      // ]
    },
  ],
])

const additionalItems = [
  [
    {
      label: 'Users',
      icon: 'i-lucide-user-pen',
      to: '/dashboard/users',
      disabled: typeof window !== 'undefined' && JSON.parse(sessionStorage.getItem('user') || 'null')?.role !== 'admin',
     
    },
  ],
]

const breadcrumbs = computed<BreadcrumbItem[]>(() =>
  Array.isArray(route.meta.breadcrumbs) ? route.meta.breadcrumbs as BreadcrumbItem[] : []
)

const logout = async() => {
  await useApiCalls().auth.logout()
  sessionStorage.removeItem('user')
  window.location.href = '/'
}

onMounted(() => {
  colorMode.preference = 'light'
  const user = sessionStorage.getItem('user')
  if (user) {
    const parsedUser = JSON.parse(user)
    if (parsedUser.role === 'admin') {
      items.value.push(...additionalItems)
    }
  }
})
</script>
