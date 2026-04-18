<script setup lang="ts">
import type { HomeStatisticCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeStatisticCard[]
}>()
</script>

<template>
  <section v-if="items.length" id="statistics" class="landing-section landing-section--stats">
    <HomeSectionHeading
      kicker="Raqamlar"
      title="Institut salohiyati aniq ko'rsatkichlarda"
      text="Animatsiyalangan counter kartalari akademik quvvat, kampus miqyosi va hamkorlik ekotizimini tez anglatadi."
    />

    <div class="landing-stats-grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="landing-stat-card"
        data-reveal
      >
        <span class="landing-stat-card__badge">{{ item.badge }}</span>
        <strong>
          <HomeAnimatedCounter :value="item.numericValue" :formatted="item.formattedValue" />
        </strong>
        <h3>{{ item.label }}</h3>
        <p>{{ item.detail }}</p>
      </article>
    </div>
  </section>
</template>
