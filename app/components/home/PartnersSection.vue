<script setup lang="ts">
import type { HomeActionLink, HomePartnerCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomePartnerCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="partners" class="landing-section landing-section--soft">
    <HomeSectionHeading
      kicker="Partners"
      title="Ishonchli hamkorlar va institutsional tarmoq"
      text="Logo yo'qligida ham premium ko'rinadigan trust kartalari hamkorlik salohiyatini aniq ko'rsatadi."
      :action="action"
    />

    <HomeCarousel aria-label="Hamkorlar koruseli">
      <a
        v-for="item in items"
        :key="item.id"
        class="landing-partner-card"
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noreferrer' : undefined"
      >
        <div class="landing-partner-card__logo" :class="{ 'is-empty': !item.imageUrl }">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
          <span v-else>{{ item.badge }}</span>
        </div>
        <strong>{{ item.title }}</strong>
      </a>
    </HomeCarousel>
  </section>
</template>
