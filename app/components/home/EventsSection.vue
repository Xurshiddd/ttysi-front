<script setup lang="ts">
import type { HomeActionLink, HomeEventCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeEventCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="events" class="landing-section landing-section--ink">
    <HomeSectionHeading
      kicker="Events"
      title="Tadbirlar, forumlar va kampus ritmi"
      text="Timeline ko'rinishidagi event kartalari foydalanuvchiga bo'lajak voqealarni aniq sanalar bilan ko'rsatadi."
      :action="action"
      light
    />

    <div class="landing-event-timeline">
      <article
        v-for="item in items"
        :key="item.id"
        class="landing-event-card"
        data-reveal
      >
        <div class="landing-event-card__date">
          <strong>{{ item.dayLabel }}</strong>
          <span>{{ item.monthLabel }}</span>
        </div>

        <div class="landing-event-card__body">
          <div class="landing-event-card__meta">
            <span>{{ item.badge }}</span>
            <span>{{ item.dateLabel }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
