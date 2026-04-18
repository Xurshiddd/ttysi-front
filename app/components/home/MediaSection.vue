<script setup lang="ts">
import type { HomeActionLink, HomeGalleryCard, HomeVideoCard } from '~/composables/useHomepageContent'

const props = defineProps<{
  videos: HomeVideoCard[]
  galleries: HomeGalleryCard[]
  action: HomeActionLink
}>()

const activeVideo = ref<HomeVideoCard | null>(null)
const activeGallery = ref<HomeGalleryCard | null>(null)

const activeGalleryImages = computed(() => {
  if (!activeGallery.value) return []
  if (activeGallery.value.images.length) return activeGallery.value.images
  if (!activeGallery.value.imageUrl) return []

  return [
    {
      id: `${activeGallery.value.id}-preview`,
      url: activeGallery.value.imageUrl
    }
  ]
})

function closeOverlay() {
  activeVideo.value = null
  activeGallery.value = null
}

watch([activeVideo, activeGallery], ([video, gallery]) => {
  if (!import.meta.client) return
  document.body.style.overflow = video || gallery ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})
</script>

<template>
  <section v-if="videos.length || galleries.length" id="media" class="landing-section">
    <HomeSectionHeading
      kicker="Media"
      title="Video va galereya orqali kampus muhitini his qiling"
      text="Video modal, galereya overlay va katta vizual kartalar sahifaga chuqurlik hamda ishonch beradi."
      :action="action"
    />

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
            @click="activeVideo = item"
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
            @click="activeGallery = item"
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

    <Teleport to="body">
      <transition name="landing-overlay">
        <div v-if="activeVideo || activeGallery" class="landing-overlay" @click.self="closeOverlay">
          <div class="landing-overlay__panel">
            <button type="button" class="landing-overlay__close" aria-label="Yopish" @click="closeOverlay">
              ×
            </button>

            <template v-if="activeVideo">
              <div class="landing-overlay__media">
                <iframe
                  v-if="activeVideo.playback === 'iframe' && activeVideo.embedUrl"
                  :src="activeVideo.embedUrl"
                  :title="activeVideo.title"
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                />

                <video
                  v-else-if="activeVideo.playback === 'html5' && activeVideo.sourceUrl"
                  controls
                  autoplay
                  playsinline
                >
                  <source :src="activeVideo.sourceUrl">
                </video>

                <a
                  v-else
                  class="landing-button"
                  :href="activeVideo.sourceUrl || action.href"
                  target="_blank"
                  rel="noreferrer"
                >
                  Videoni yangi oynada ochish
                </a>
              </div>

              <div class="landing-overlay__copy">
                <p class="landing-kicker">Video</p>
                <h3>{{ activeVideo.title }}</h3>
                <p>{{ activeVideo.summary }}</p>
              </div>
            </template>

            <template v-else-if="activeGallery">
              <div class="landing-overlay__copy">
                <p class="landing-kicker">Galereya</p>
                <h3>{{ activeGallery.title }}</h3>
                <p>{{ activeGallery.summary }}</p>
              </div>

              <div class="landing-overlay__gallery">
                <img
                  v-for="image in activeGalleryImages"
                  :key="image.id"
                  :src="image.url"
                  :alt="activeGallery.title"
                >
              </div>
            </template>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>
