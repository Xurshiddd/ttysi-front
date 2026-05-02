<script setup lang="ts">
const { finishBoot } = useGlobalLoader()

onMounted(() => {
  finishBoot()
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppGlobalLoader />
    <NuxtPage />
    <AppScrollTop />
  </div>
</template>
