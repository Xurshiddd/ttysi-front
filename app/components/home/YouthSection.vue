<script setup lang="ts">
import type { HomeActionLink, HomeYouthCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeYouthCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="youth" class="landing-section landing-section--soft">
    <HomeSectionHeading
      kicker="Student life"
      title="Faol yoshlar va talabalar tashabbuslari"
      text="Bu blok institut muhitini yanada jonli ko'rsatadi: tashabbus, liderlik va ijodkorlik bir sahifada uyg'unlashadi."
      :action="action"
    />

    <div class="landing-youth-grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="landing-youth-card"
        data-reveal
      >
        <div class="landing-youth-card__avatar" :class="{ 'is-empty': !item.imageUrl }">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
          <span v-else>{{ item.badge }}</span>
        </div>

        <div class="landing-youth-card__body">
          <span class="landing-youth-card__subtitle">{{ item.subtitle }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
