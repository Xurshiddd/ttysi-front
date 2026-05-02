<script setup lang="ts">
const isVisible = ref(false)

function syncVisibility() {
  isVisible.value = window.scrollY > 420
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  syncVisibility()
  window.addEventListener('scroll', syncVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncVisibility)
})
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-top"
      aria-label="Tepaga qaytish"
      title="Tepaga qaytish"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M12 19V5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <path d="m6.5 10.5 5.5-5.5 5.5 5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </Transition>
</template>
