<script setup lang="ts">
const props = defineProps<{
  title: string
  establishedYear: number | null
  mediaType: 'image' | 'video' | null
  mediaUrl: string | null
}>()

const heroLinks = [
  {
    label: 'Rektorga murojaat yuborish',
    href: '#',
    icon: 'form'
  },
  {
    label: "Ko'p beriladigan savollar",
    href: '#',
    icon: 'question'
  },
  {
    label: 'Hujjatlarni onlayn yuborish',
    href: '#',
    icon: 'monitor'
  }
]

const heroStyle = computed(() =>
  props.mediaType === 'image' && props.mediaUrl
    ? {
        '--landing-hero-image': `url("${props.mediaUrl}")`
      }
    : undefined
)

function playHeroVideo(event: Event) {
  const video = event.currentTarget as HTMLVideoElement | null

  if (!video) return

  video.loop = true
  void video.play()
}

function replayHeroVideo(event: Event) {
  const video = event.currentTarget as HTMLVideoElement | null

  if (!video) return

  video.currentTime = 0
  void video.play()
}
</script>

<template>
  <section id="top" class="landing-hero" :style="heroStyle">
    <video
      v-if="mediaType === 'video' && mediaUrl"
      class="landing-hero__video"
      :src="mediaUrl"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
      @canplay="playHeroVideo"
      @ended="replayHeroVideo"
    ></video>

    <div class="landing-hero__inner" data-reveal>
      <div class="landing-hero__copy">
        <h1>{{ title }}</h1>
        <p v-if="establishedYear" class="landing-hero__since">{{ establishedYear }}-yildan beri</p>
      </div>

      <div class="landing-hero__quick-links" aria-label="Tezkor havolalar">
        <a
          v-for="(item, index) in heroLinks"
          :key="item.label"
          class="landing-hero__quick-link"
          :href="item.href"
        >
          <span class="landing-hero__quick-dot" aria-hidden="true" />
          <span class="landing-hero__quick-body">
            <span class="landing-hero__quick-icon" :data-icon="item.icon" aria-hidden="true">
              <svg v-if="index === 0" viewBox="0 0 32 32" role="img">
                <path d="M7 4h15l4 4v20H7z" />
                <path d="M22 4v5h5M11 12h10M11 17h10M11 22h7M9 13l1.5 1.5L13 11M9 18l1.5 1.5L13 16" />
              </svg>
              <svg v-else-if="index === 1" viewBox="0 0 32 32" role="img">
                <path d="M6 15a10 10 0 0 1 17.5-6.6A8 8 0 0 1 25 22l2 6-6-2a10 10 0 0 1-15-11z" />
                <path d="M15 18v-1.2c0-1.7 3-2 3-4.6 0-1.8-1.4-3.2-3.6-3.2-1.7 0-3 .8-3.8 1.9M15 22h.1" />
              </svg>
              <svg v-else viewBox="0 0 32 32" role="img">
                <path d="M6 7h20v14H6zM12 26h8M16 21v5M10 11h8M10 15h8M21 11h2M21 15h2" />
                <path d="M11 12l1 1 2-2M11 16l1 1 2-2" />
              </svg>
            </span>
            <span>{{ item.label }}</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>
