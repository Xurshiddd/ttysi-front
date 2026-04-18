<script setup lang="ts">
import type { HomeActionLink, HomeFacultyCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeFacultyCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="faculties" class="landing-section">
    <HomeSectionHeading
      kicker="Faculties"
      title="Akademik yo'nalishlar professional ekotizim sifatida"
      text="Har bir fakultet o'zining joylashuvi, qisqa tavsifi va asosiy ko'rsatkichlari bilan alohida premium karta sifatida taqdim etiladi."
      :action="action"
    />

    <div class="landing-faculty-grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="landing-faculty-card"
        data-reveal
      >
        <div class="landing-faculty-card__cover" :class="{ 'is-empty': !item.imageUrl }">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
          <span v-else>{{ item.badge }}</span>
        </div>

        <div class="landing-faculty-card__body">
          <div class="landing-faculty-card__meta">
            <span>{{ item.location }}</span>
            <span>{{ item.badge }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>

          <div class="landing-faculty-card__stats">
            <div v-for="metric in item.metrics" :key="metric.label">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
