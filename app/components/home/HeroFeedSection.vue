<script setup lang="ts">
import type { HomeAnnouncementCard, HomeEventCard, HomeStoryCard } from '~/composables/useHomepageContent'

type HeroFeedKey = 'news' | 'announcements' | 'events'

const props = defineProps<{
  news: HomeStoryCard[]
  announcements: HomeAnnouncementCard[]
  events: HomeEventCard[]
}>()

const activeFeed = ref<HeroFeedKey>('news')

const tabs: Array<{ key: HeroFeedKey, label: string, href: string }> = [
  {
    key: 'news',
    label: 'Yangiliklar',
    href: '#news'
  },
  {
    key: 'announcements',
    label: "E'lonlar",
    href: '#announcements'
  },
  {
    key: 'events',
    label: 'Tadbirlar',
    href: '#events'
  }
]

const activeItems = computed<HomeStoryCard[]>(() => {
  if (activeFeed.value === 'announcements') return props.announcements
  if (activeFeed.value === 'events') return props.events

  return props.news
})

const activeHref = computed(() =>
  tabs.find((item) => item.key === activeFeed.value)?.href || '#news'
)

const hasItems = computed(() =>
  props.news.length || props.announcements.length || props.events.length
)
</script>

<template>
  <section v-if="hasItems" class="landing-hero-feed" aria-label="Asosiy axborotlar">
    <div class="landing-hero-feed__head">
      <div class="landing-hero-feed__tabs" role="tablist" aria-label="Axborot turi">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="landing-hero-feed__tab"
          :class="{ 'is-active': activeFeed === tab.key }"
          role="tab"
          :aria-selected="String(activeFeed === tab.key)"
          @click="activeFeed = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <a class="landing-hero-feed__more" :href="activeHref">
        Hammasini ko'rish
      </a>
    </div>

    <div class="landing-hero-feed__panel">
      <a
        v-for="item in activeItems.slice(0, 4)"
        :key="`${activeFeed}-${item.id}`"
        class="landing-hero-feed__card"
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noreferrer' : undefined"
      >
        <span class="landing-hero-feed__image" :class="{ 'is-empty': !item.imageUrl }">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
          <span v-else>{{ item.badge }}</span>
        </span>

        <span class="landing-hero-feed__body">
          <span class="landing-hero-feed__meta">
            <span class="landing-hero-feed__dot" aria-hidden="true" />
            {{ item.dateLabel }}
          </span>
          <strong>{{ item.title }}</strong>
        </span>
      </a>
    </div>
  </section>
</template>
