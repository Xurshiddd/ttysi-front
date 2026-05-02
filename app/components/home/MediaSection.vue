<script setup lang="ts">
import type { HomeActionLink, HomeGalleryCard, HomeVideoCard } from '~/composables/useHomepageContent'

const props = defineProps<{
  videos: HomeVideoCard[]
  galleries: HomeGalleryCard[]
  action: HomeActionLink
}>()

const videoLightboxItems = computed(() =>
  props.videos
    .map((item) => {
      const url = item.playback === 'iframe' ? item.embedUrl : item.sourceUrl
      if (!url) return null

      return {
        id: `video-${item.id}`,
        type: item.playback === 'iframe' ? 'iframe' as const : 'video' as const,
        url,
        title: item.title,
        description: item.summary,
        poster: item.imageUrl
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
)

const galleryLightboxItems = computed(() =>
  props.galleries.flatMap((gallery) => {
    const images = gallery.images.length
      ? gallery.images
      : gallery.imageUrl
        ? [{ id: `${gallery.id}-preview`, url: gallery.imageUrl }]
        : []

    return images.map((image) => ({
      id: `gallery-${gallery.id}-${image.id}`,
      type: 'image' as const,
      url: image.url,
      title: gallery.title,
      description: gallery.summary
    }))
  })
)

const lightboxItems = computed(() => [
  ...videoLightboxItems.value,
  ...galleryLightboxItems.value
])

function videoLightboxIndex(item: HomeVideoCard) {
  return lightboxItems.value.findIndex((entry) => entry.id === `video-${item.id}`)
}

function galleryLightboxIndex(item: HomeGalleryCard) {
  const index = lightboxItems.value.findIndex((entry) => String(entry.id).startsWith(`gallery-${item.id}-`))
  return index
}

function openLightbox(open: (index?: number) => void, index: number) {
  if (index < 0) return
  open(index)
}
</script>

<template>
  <section v-if="videos.length || galleries.length" id="media" class="landing-section">
    <HomeSectionHeading
      kicker="Media"
      title="Video va galereya orqali kampus muhitini his qiling"
      text="Video modal, galereya overlay va katta vizual kartalar sahifaga chuqurlik hamda ishonch beradi."
      :action="action"
    />

    <MediaLightbox :items="lightboxItems" v-slot="{ open }">
      <div class="landing-media-layout">
        <section v-if="videos.length" class="landing-media-block" data-reveal>
          <div class="landing-media-block__head">
            <p class="landing-card-label">Videolar</p>
            <h3>Institut hayoti va infratuzilmasi</h3>
          </div>

          <div class="landing-video-grid">
            <button
              v-for="item in videos.slice(0, 3)"
              :key="item.id"
              type="button"
              class="landing-video-card"
              @click="openLightbox(open, videoLightboxIndex(item))"
            >
              <div class="landing-video-card__cover" :class="{ 'is-empty': !item.imageUrl }">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
                <span v-else>Play</span>
                <span class="landing-video-card__play">Play</span>
              </div>

              <div class="landing-video-card__body">
                <span>{{ item.dateLabel }}</span>
                <h4>{{ item.title }}</h4>
                <p>{{ item.summary }}</p>
              </div>
            </button>
          </div>
        </section>

        <section v-if="galleries.length" class="landing-media-block" data-reveal>
          <div class="landing-media-block__head">
            <p class="landing-card-label">Galereya</p>
            <h3>Fotojamlanmalar va kampus lavhalari</h3>
          </div>

          <div class="landing-gallery-grid">
            <button
              v-for="item in galleries.slice(0, 4)"
              :key="item.id"
              type="button"
              class="landing-gallery-card"
              @click="openLightbox(open, galleryLightboxIndex(item))"
            >
              <div class="landing-gallery-card__cover" :class="{ 'is-empty': !item.imageUrl }">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
                <span v-else>{{ item.countLabel }}</span>
              </div>

              <div class="landing-gallery-card__body">
                <span>{{ item.countLabel }}</span>
                <h4>{{ item.title }}</h4>
                <p>{{ item.dateLabel }}</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </MediaLightbox>
  </section>
</template>
