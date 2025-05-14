<template>
   <div @click="() => navigateTo('dashboard')">
       <h1>Conference</h1>
       <h2>Welcome to the conference</h2>
   </div>

   <div class="homepage">
    <h1>Vitajte v systéme konferencií</h1>
    <p>Spravujte ročníky, podstránky a používateľov konferencie.</p>

    <!-- Odkaz na stránku konferencií -->
    <div class="navigation">
        <div class="index-page" @click="navigateTo('conferences')">
        Prejsť na správu konferencií
        </div>
    </div>
  </div>


</template>
















<script setup>
</script>

<style scoped>
.homepage {
  padding: 2rem;
  text-align: center;
}

.navigation {
  margin-top: 2rem;
}

.conference-link {
  display: inline-block;
  background-color: #1d4ed8;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
}

.conference-link:hover {
  background-color: #2563eb;
}
</style>
