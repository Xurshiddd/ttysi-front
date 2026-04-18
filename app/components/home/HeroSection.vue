<script setup lang="ts">
import type {
  HomeActionLink,
  HomeHeroSpotlight,
  HomeSocialLink,
  HomeStatisticCard
} from '~/composables/useHomepageContent'

const props = defineProps<{
  title: string
  description: string
  chips: string[]
  ctas: HomeActionLink[]
  socials: HomeSocialLink[]
  spotlight: HomeHeroSpotlight | null
  stats: HomeStatisticCard[]
  address: string
  rectorName: string
  establishedYear: number | null
  phone: string
  email: string
  imageUrl: string | null
}>()

const scene = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)

const heroStyle = computed(() =>
  props.imageUrl
    ? {
        '--landing-hero-image': `url("${props.imageUrl}")`
      }
    : undefined
)

function prefersReducedMotion() {
  if (!import.meta.client) return true
  if (document.documentElement.dataset.reduceMotion === 'true') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function updateTilt(event: PointerEvent) {
  if (!scene.value || prefersReducedMotion()) return

  const rect = scene.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  tiltX.value = Number((y * -10).toFixed(2))
  tiltY.value = Number((x * 10).toFixed(2))
}

function resetTilt() {
  tiltX.value = 0
  tiltY.value = 0
}
</script>

<template>
  <section
    id="top"
    ref="scene"
    class="landing-hero"
    :style="heroStyle"
    @pointermove="updateTilt"
    @pointerleave="resetTilt"
  >
    <div class="landing-hero__backdrop" />
    <div class="landing-hero__grain" />

    <div class="landing-hero__copy" data-reveal>
      <span class="landing-pill">Rasmiy welcome page</span>
      <p class="landing-kicker">Premium institute experience</p>
      <h1>{{ title }}</h1>
      <p class="landing-hero__lead">{{ description }}</p>

      <div v-if="chips.length" class="landing-chip-row">
        <span v-for="chip in chips" :key="chip" class="landing-chip">{{ chip }}</span>
      </div>

      <div class="landing-hero__actions">
        <a
          v-for="action in ctas"
          :key="action.label"
          class="landing-button"
          :class="{ 'landing-button--ghost': action !== ctas[0] }"
          :href="action.href"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noreferrer' : undefined"
        >
          {{ action.label }}
        </a>
      </div>

      <div v-if="socials.length" class="landing-social-row">
        <a
          v-for="item in socials"
          :key="item.id"
          class="landing-social"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
        >
          <span class="landing-social__badge">{{ item.badge }}</span>
          <span>{{ item.label }}</span>
        </a>
      </div>
    </div>

    <div class="landing-hero__visual" data-reveal>
      <article
        class="landing-hero-card landing-hero-card--spotlight"
        :style="{ transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }"
      >
        <div class="landing-hero-card__image" :class="{ 'is-empty': !spotlight?.imageUrl }">
          <img v-if="spotlight?.imageUrl" :src="spotlight.imageUrl" :alt="spotlight.title">
          <span v-else>{{ spotlight?.badge || 'TT' }}</span>
        </div>

        <div class="landing-hero-card__body">
          <div class="landing-hero-card__meta">
            <span>{{ spotlight?.badge || 'Institut spotlight' }}</span>
            <span>{{ spotlight?.dateLabel || 'Doimiy yangilanish' }}</span>
          </div>
          <h2>{{ spotlight?.title || "Institutdagi eng muhim yo'nalishlar" }}</h2>
          <p>{{ spotlight?.summary || "Bosh sahifa institutning ishonchli, zamonaviy va faol imijini birinchi ekrandanoq ko'rsatadi." }}</p>
        </div>
      </article>

      <div class="landing-hero__aside">
        <article class="landing-glass-card landing-glass-card--info">
          <p class="landing-card-label">Institut ma'lumoti</p>
          <strong>{{ establishedYear ? `${establishedYear}` : 'Rasmiy' }}</strong>
          <span>{{ address }}</span>
        </article>

        <article class="landing-glass-card landing-glass-card--person">
          <p class="landing-card-label">Rektor</p>
          <strong>{{ rectorName }}</strong>
          <span>Strategik boshqaruv va institut rivoji</span>
        </article>

        <article class="landing-glass-card landing-glass-card--contact">
          <a :href="`mailto:${email}`">{{ email }}</a>
          <a :href="`tel:${phone.replace(/[^\d+]/g, '')}`">{{ phone }}</a>
        </article>
      </div>

      <div v-if="stats.length" class="landing-hero__stats">
        <article v-for="item in stats.slice(0, 3)" :key="item.id" class="landing-mini-stat">
          <span class="landing-mini-stat__badge">{{ item.badge }}</span>
          <strong>{{ item.formattedValue }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </div>
  </section>
</template>
