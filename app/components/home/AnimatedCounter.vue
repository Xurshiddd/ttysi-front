<script setup lang="ts">
const props = defineProps<{
  value: number
  formatted: string
  duration?: number
}>()

const root = ref<HTMLElement | null>(null)
const displayValue = ref('0')
let observer: IntersectionObserver | null = null

function prefersReducedMotion() {
  if (!import.meta.client) return true
  if (document.documentElement.dataset.reduceMotion === 'true') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function animateValue() {
  if (!import.meta.client) return

  if (prefersReducedMotion() || !Number.isFinite(props.value)) {
    displayValue.value = props.formatted
    return
  }

  const duration = props.duration ?? 1400
  const start = performance.now()

  const step = (time: number) => {
    const progress = Math.min((time - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(props.value * eased)
    displayValue.value = new Intl.NumberFormat().format(current)

    if (progress < 1) {
      window.requestAnimationFrame(step)
    } else {
      displayValue.value = props.formatted
    }
  }

  window.requestAnimationFrame(step)
}

onMounted(() => {
  if (!root.value) return

  if (prefersReducedMotion()) {
    displayValue.value = props.formatted
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      animateValue()
      observer?.disconnect()
    },
    {
      threshold: 0.5
    }
  )

  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(
  () => props.formatted,
  () => {
    if (!displayValue.value || displayValue.value === '0') {
      displayValue.value = props.formatted
    }
  },
  { immediate: true }
)
</script>

<template>
  <span ref="root">{{ displayValue }}</span>
</template>
