<template>
    <div>
        <main class="max-w-6xl mx-auto h-screen">
            <slot />
        </main>
        <footer>
            <p>&copy; 2023 My Application</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
colorMode.preference = 'light';

</script>

<style scoped>

</style>