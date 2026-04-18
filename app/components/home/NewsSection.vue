<script setup lang="ts">
import type { HomeActionLink, HomeStoryCard } from '~/composables/useHomepageContent'

defineProps<{
  items: HomeStoryCard[]
  action: HomeActionLink
}>()
</script>

<template>
  <section v-if="items.length" id="news" class="landing-section">
    <HomeSectionHeading
      kicker="Latest news"
      title="So'nggi yangiliklar va institutdagi muhim yangilanishlar"
      text="Katta hero kartasi va yonidagi editorial kartalar foydalanuvchini tezda asosiy axborot oqimiga olib kiradi."
      :action="action"
    />

    <div class="landing-news-layout" :class="{ 'landing-news-layout--single': items.length < 2 }">
      <article class="landing-story-card landing-story-card--featured" data-reveal>
        <div class="landing-story-card__media" :class="{ 'is-empty': !items[0]?.imageUrl }">
          <img v-if="items[0]?.imageUrl" :src="items[0].imageUrl" :alt="items[0].title">
          <span v-else>{{ items[0]?.badge || 'NW' }}</span>
        </div>

        <div class="landing-story-card__body">
          <div class="landing-story-card__meta">
            <span>{{ items[0]?.badge }}</span>
            <span>{{ items[0]?.dateLabel }}</span>
          </div>
          <h3>{{ items[0]?.title }}</h3>
          <p>{{ items[0]?.summary }}</p>
          <a class="landing-inline-link" :href="items[0]?.href || action.href">Batafsil ko'rish</a>
        </div>
      </article>

      <div v-if="items.length > 1" class="landing-news-stack">
        <article
          v-for="item in items.slice(1, 4)"
          :key="item.id"
          class="landing-story-card landing-story-card--compact"
          data-reveal
        >
          <div class="landing-story-card__media landing-story-card__media--compact" :class="{ 'is-empty': !item.imageUrl }">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
            <span v-else>{{ item.badge }}</span>
          </div>

          <div class="landing-story-card__body">
            <div class="landing-story-card__meta">
              <span>{{ item.badge }}</span>
              <span>{{ item.dateLabel }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
