<script setup lang="ts">

</script>

<template>
  <div class="navbar-box">
    <div class="navbar-start">
      <div class="navbar-brand">
        <h1 class="font-bold uppercase text-2xl">NGX Music</h1>
      </div>
      <div class="navbar-quick">
        <button class="quick-action-button">Home</button>
      </div>
    </div>
    <div class="navbar-middle">
      <form class="navbar-search-box">
        <input class="navbar-search-input" type="text" alt="search something right here" placeholder="search">
        <button class="text-white pr-4" type="button"><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <button class="quick-action-button">Login</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-end {
  @apply mr-20 ml-auto
}
.navbar-search-box {
  @apply flex gap-2 bg-gray-950
}
.navbar-search-input {
  @apply w-96 px-5 py-1 rounded text-white placeholder-amber-50 bg-transparent;
  outline: none;
}
.navbar-middle {
  @apply mx-auto
}
.quick-action-button {
  @apply text-white p-5 hover:bg-gray-700
}
.navbar-start {
  @apply ml-20 mr-auto flex items-center gap-2
}
.navbar-box {
  @apply bg-gray-900 w-screen flex justify-between items-center
}

h1 {
  @apply text-white
}
</style>