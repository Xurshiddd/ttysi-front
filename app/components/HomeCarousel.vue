<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Carousel'
  }
)

const track = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function syncScrollState() {
  const element = track.value
  if (!element) return

  const maxScrollLeft = element.scrollWidth - element.clientWidth
  canScrollPrev.value = element.scrollLeft > 8
  canScrollNext.value = element.scrollLeft < maxScrollLeft - 8
}

function scrollTrack(direction: 1 | -1) {
  const element = track.value
  if (!element) return

  element.scrollBy({
    left: element.clientWidth * 0.82 * direction,
    behavior: 'smooth'
  })
}

function onResize() {
  syncScrollState()
}

onMounted(() => {
  syncScrollState()
  track.value?.addEventListener('scroll', syncScrollState, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  track.value?.removeEventListener('scroll', syncScrollState)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="home-carousel">
    <div class="home-carousel__controls">
      <button
        type="button"
        class="home-carousel__button"
        :disabled="!canScrollPrev"
        :aria-label="`${props.ariaLabel} oldingi`"
        @click="scrollTrack(-1)"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        class="home-carousel__button"
        :disabled="!canScrollNext"
        :aria-label="`${props.ariaLabel} keyingi`"
        @click="scrollTrack(1)"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div
      ref="track"
      class="home-carousel__track"
      :aria-label="props.ariaLabel"
      tabindex="0"
    >
      <slot />
    </div>
  </div>
</template>
