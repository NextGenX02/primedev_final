<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import NewUploads from "@/components/home/newUploads.vue";

document.title = "NextGenX Music"
</script>

<template>
  <div class="main-content-home">
    <navbar/>
    <div class="content-container">
      <new-uploads/>
    </div>
  </div>
</template>
<style>
.content-container {
  @apply w-3/4 flex flex-col h-screen mx-auto
}
.main-content-home {
  @apply flex bg-gray-950 w-screen h-screen max-w-full max-h-screen flex-col gap-6
}
</style>
