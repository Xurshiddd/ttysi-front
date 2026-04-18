<script setup lang="ts">
import type { HomeActionLink, HomeAnnouncementCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeAnnouncementCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="announcements" class="landing-section landing-section--soft">
    <HomeSectionHeading
      kicker="Announcements"
      title="Abituriyent va talabalar uchun muhim e'lonlar"
      text="Badges, sana ko'rsatkichlari va yuqori kontrastli kartalar e'lonlarni yangiliklardan aniq ajratadi."
      :action="action"
    />

    <div class="landing-announcement-grid" :class="{ 'landing-announcement-grid--single': items.length < 2 }">
      <article class="landing-alert-card landing-alert-card--lead" data-reveal>
        <div class="landing-alert-card__meta">
          <span>{{ items[0]?.priority || 'Primary notice' }}</span>
          <span>{{ items[0]?.dateLabel }}</span>
        </div>
        <h3>{{ items[0]?.title }}</h3>
        <p>{{ items[0]?.summary }}</p>
        <a class="landing-button landing-button--ghost" :href="items[0]?.href || action.href">Muhim e'lonlar</a>
      </article>

      <div v-if="items.length > 1" class="landing-alert-list">
        <article
          v-for="item in items.slice(1, 5)"
          :key="item.id"
          class="landing-alert-card"
          data-reveal
        >
          <div class="landing-alert-card__meta">
            <span>{{ item.badge }}</span>
            <span>{{ item.dateLabel }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
