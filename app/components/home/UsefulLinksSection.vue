<script setup lang="ts">
import type { HomeActionLink, HomeUsefulLinkCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeUsefulLinkCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="links" class="landing-section">
    <HomeSectionHeading
      kicker="Useful links"
      title="Tezkor xizmatlar va kerakli platformalar"
      text="Functional quick-access kartalar foydalanuvchini bir necha sekund ichida kerakli servisga olib boradi."
      :action="action"
    />

    <div class="landing-links-grid">
      <a
        v-for="item in items"
        :key="item.id"
        class="landing-link-card"
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noreferrer' : undefined"
        data-reveal
      >
        <span class="landing-link-card__badge">{{ item.badge }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.note }}</span>
      </a>
    </div>
  </section>
</template>
