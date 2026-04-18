<script setup lang="ts">
import type { HomeActionLink } from '~/composables/useHomepageContent'

defineProps<{
  kicker: string
  title: string
  text: string
  action?: HomeActionLink | null
  light?: boolean
}>()
</script>

<template>
  <div class="landing-section-heading" :class="{ 'landing-section-heading--light': light }" data-reveal>
    <div class="landing-section-heading__copy">
      <p class="landing-kicker">{{ kicker }}</p>
      <h2>{{ title }}</h2>
    </div>

    <div class="landing-section-heading__meta">
      <p>{{ text }}</p>

      <a
        v-if="action"
        class="landing-inline-link"
        :href="action.href"
        :target="action.external ? '_blank' : undefined"
        :rel="action.external ? 'noreferrer' : undefined"
      >
        {{ action.label }}
      </a>
    </div>
  </div>
</template>
