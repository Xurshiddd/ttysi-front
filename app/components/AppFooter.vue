<script setup lang="ts">
import type { Attachment, FrontendLocale } from '~/composables/useNavbarData'
import type { FooterSocialNetwork } from '~/composables/useFooterData'

const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')
const { data } = useFooterData(selectedLocale)
const config = useRuntimeConfig()
const currentYear = new Date().getFullYear()

function normalizeText(value?: string | null) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function initials(value?: string | null, fallback = 'TT') {
  const words = normalizeText(value).split(' ').filter(Boolean)
  if (!words.length) return fallback
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function resolveUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  const base = String(config.public.apiBase || '').replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

function resolveAttachment(asset?: Attachment | null) {
  return resolveUrl(asset?.url)
}

function phoneHref(value?: string | null) {
  return `tel:${(value ?? '').replace(/[^\d+]/g, '')}`
}

function socialTitle(item: FooterSocialNetwork) {
  return item.title || 'Tarmoq'
}

const siteName = computed(
  () => data.value?.site_information?.name || "Toshkent to'qimachilik va yengil sanoati instituti"
)
const siteAddress = computed(() => data.value?.site_information?.address || 'Toshkent shahri')
const siteLogo = computed(() => resolveAttachment(data.value?.site_setting?.icon))
const phones = computed(() => data.value?.site_information?.phones ?? [])
const emails = computed(() => data.value?.site_information?.emails ?? [])
const socialNetworks = computed(() =>
  [...(data.value?.social_networks ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
)
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__top">
      <div class="site-footer__brand home-reveal">
        <div class="site-footer__brand-mark">
          <img
            v-if="siteLogo"
            :src="siteLogo"
            :alt="siteName"
            class="site-footer__logo"
          >
          <span v-else class="site-footer__badge">{{ initials(siteName) }}</span>
        </div>

        <div class="site-footer__brand-copy">
          <p class="home-kicker">Footer</p>
          <h2>{{ siteName }}</h2>
          <p>{{ siteAddress }}</p>
        </div>
      </div>

      <div class="site-footer__grid">
        <section class="site-footer__column home-reveal">
          <p class="site-footer__label">Bog'lanish</p>

          <a
            v-for="phone in phones"
            :key="phone"
            :href="phoneHref(phone)"
            class="site-footer__contact"
          >
            {{ phone }}
          </a>

          <a
            v-for="email in emails"
            :key="email"
            :href="`mailto:${email}`"
            class="site-footer__contact"
          >
            {{ email }}
          </a>
        </section>

        <section class="site-footer__column home-reveal home-reveal--delay">
          <p class="site-footer__label">Ijtimoiy tarmoqlar</p>

          <div class="site-footer__socials">
            <a
              v-for="item in socialNetworks"
              :key="item.id"
              :href="resolveUrl(item.link) || '#'"
              class="site-footer__social"
              :aria-label="socialTitle(item)"
              target="_blank"
              rel="noreferrer"
            >
              <span class="site-footer__social-icon">{{ initials(socialTitle(item), 'SN') }}</span>
              <span>{{ socialTitle(item) }}</span>
            </a>
          </div>
        </section>

        <section class="site-footer__column home-reveal">
          <p class="site-footer__label">Tezkor yo'l</p>

          <div class="site-footer__links">
            <a href="#faculties" class="site-footer__quick-link">Fakultetlar</a>
            <a href="#updates" class="site-footer__quick-link">Yangiliklar</a>
            <a href="#" class="site-footer__quick-link">Tepaga qaytish</a>
          </div>
        </section>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>© {{ currentYear }} {{ siteName }}. Barcha huquqlar himoyalangan.</p>
      <span>Accessibility-first institut sayti</span>
    </div>
  </footer>
</template>
