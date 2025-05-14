<template>
    <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-900">
      <!-- HEADER -->
      <header class="shadow bg-white sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 class="text-xl font-bold tracking-tight">Konferenčný systém</h1>
        </div>
      </header>
  
      <!-- MAIN CONTENT -->
      <main class="container mx-auto px-4 py-8 flex-1">
        <slot />
      </main>
  
      <!-- FOOTER -->
      <footer class="py-4 text-center text-sm text-gray-500 border-t bg-white">
        &copy; {{ new Date().getFullYear() }} Všetky práva vyhradené.
      </footer>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
colorMode.preference = 'light';

</script>

<style scoped>

</style>