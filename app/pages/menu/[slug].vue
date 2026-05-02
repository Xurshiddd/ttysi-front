<script setup lang="ts">
import type { Attachment, FrontendLocale, MenuItem } from '~/composables/useNavbarData'

const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')
const { data } = useNavbarData(selectedLocale)
const route = useRoute()
const config = useRuntimeConfig()

function normalizeText(value?: string | null) {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(value?: string | null, max = 180) {
  const text = normalizeText(value)
  if (!text) return "Ushbu menyu uchun tavsif hali kiritilmagan."
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text
}

function resolveUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  const base = String(config.public.apiBase || '').replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

function attachmentLabel(item: Attachment) {
  return item.name || 'Fayl'
}

function sortAttachments(items?: Attachment[] | null) {
  return [...(items ?? [])].sort((left, right) => left.order - right.order)
}

function mediaType(item: Attachment) {
  if (item.mime_type?.startsWith('video/')) return 'video'
  return 'image'
}

const menuId = computed(() => extractMenuIdFromParam(route.params.slug))
const rootMenus = computed(() => sortMenuItems(data.value?.menus))
const menuTrail = computed(() => findMenuTrail(rootMenus.value, menuId.value))
const currentMenu = computed<MenuItem | null>(() => menuTrail.value[menuTrail.value.length - 1] ?? null)
const childMenus = computed(() => sortMenuItems(currentMenu.value?.children))
const mediaItems = computed(() =>
  sortAttachments(currentMenu.value?.media).filter((item) => resolveUrl(item.url))
)
const carouselMediaItems = computed(() =>
  mediaItems.value.filter((item) => {
    const type = mediaType(item)
    return type === 'image' || type === 'video'
  })
)
const lightboxMediaItems = computed(() =>
  carouselMediaItems.value
    .map((item) => {
      const url = resolveUrl(item.url)

      if (!url) return null

      return {
        id: item.id,
        type: mediaType(item),
        url,
        title: attachmentLabel(item),
        mimeType: item.mime_type
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
)
const documentItems = computed(() =>
  sortAttachments(currentMenu.value?.documents).filter((item) => resolveUrl(item.url))
)
const heroImage = computed(() => {
  const imageItem = sortAttachments(currentMenu.value?.media).find((item) => {
    const url = resolveUrl(item.url)
    return url && (!item.mime_type || item.mime_type.startsWith('image/'))
  })

  return imageItem ? resolveUrl(imageItem.url) : null
})
const menuHeroStyle = computed(() =>
  heroImage.value
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(16, 31, 57, 0.26), rgba(10, 31, 64, 0.66)), linear-gradient(90deg, rgba(20, 47, 92, 0.18), rgba(20, 47, 92, 0.18)), url('${heroImage.value}')`
      }
    : undefined
)
const pageTitle = computed(() => currentMenu.value ? `${menuLabel(currentMenu.value)} | TTYSI` : 'Menu sahifasi | TTYSI')
const pageDescription = computed(() =>
  currentMenu.value?.description || "Tanlangan menyu bo'limi ma'lumotlari."
)
const overviewTitleHtml = computed(() =>
  currentMenu.value?.title || currentMenu.value?.name || 'Menu'
)
const overviewDescriptionHtml = computed(() =>
  currentMenu.value?.description || "Ushbu menyu uchun asosiy ma'lumotlar shu sahifada jamlandi."
)
const parentMenu = computed<MenuItem | null>(() =>
  menuTrail.value.length > 1 ? menuTrail.value[menuTrail.value.length - 2] ?? null : null
)
const siblingMenus = computed(() =>
  parentMenu.value ? sortMenuItems(parentMenu.value.children) : rootMenus.value
)

function isCurrentMenu(item: MenuItem) {
  return item.id === currentMenu.value?.id
}

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'article',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <main class="page-shell page-menu-detail">
    <AppNavbar />

    <section class="menu-page-hero" :style="menuHeroStyle">
      <div class="menu-page-hero__veil" />

      <template v-if="currentMenu">
        <div class="menu-page-hero__content home-reveal">
          <div class="menu-page__breadcrumbs menu-page__breadcrumbs--hero">
            <NuxtLink to="/" class="menu-page__crumb-home">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M4.5 10.8 12 4l7.5 6.8v8a1.2 1.2 0 0 1-1.2 1.2h-4.1v-5.3h-4.4V20H5.7a1.2 1.2 0 0 1-1.2-1.2v-8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              </svg>
              <span>Bosh sahifa</span>
            </NuxtLink>
            <span v-for="item in menuTrail" :key="item.id">
              <span class="menu-page__breadcrumbs-separator">/</span>
              <span>{{ menuLabel(item) }}</span>
            </span>
          </div>

          <h1 class="menu-page-hero__title">{{ menuLabel(currentMenu) }}</h1>
        </div>
      </template>

      <template v-else>
        <div class="menu-page-hero__content home-reveal">
          <div class="menu-page__breadcrumbs menu-page__breadcrumbs--hero">
            <NuxtLink to="/" class="menu-page__crumb-home">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M4.5 10.8 12 4l7.5 6.8v8a1.2 1.2 0 0 1-1.2 1.2h-4.1v-5.3h-4.4V20H5.7a1.2 1.2 0 0 1-1.2-1.2v-8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              </svg>
              <span>Bosh sahifa</span>
            </NuxtLink>
          </div>
          <h1 class="menu-page-hero__title">Bu menyu uchun ma'lumot topilmadi</h1>
        </div>
      </template>
    </section>

    <section v-if="currentMenu" class="home-section menu-page-layout">
      <div class="menu-page-layout__main">
        <article class="home-surface menu-page-overview__lead home-reveal">
          <MediaLightbox v-if="lightboxMediaItems.length" :items="lightboxMediaItems" v-slot="{ open }">
            <HomeCarousel aria-label="Menu media karuseli">
              <button
                v-for="(item, index) in carouselMediaItems"
                :key="`overview-media-${item.id}`"
                type="button"
                class="menu-page-media-card"
                @click="open(index)"
              >
                <img
                  v-if="mediaType(item) === 'image'"
                  :src="resolveUrl(item.url) || ''"
                  :alt="attachmentLabel(item)"
                  class="menu-page-media-card__asset"
                >

                <video
                  v-else
                  class="menu-page-media-card__asset"
                  muted
                  preload="metadata"
                  playsinline
                >
                  <source :src="resolveUrl(item.url) || ''" :type="item.mime_type || 'video/mp4'">
                </video>
              </button>
            </HomeCarousel>
          </MediaLightbox>

          <h2 v-html="overviewTitleHtml" />
          <div v-html="overviewDescriptionHtml" />
        </article>

        <article class="home-surface home-surface--compact home-reveal home-reveal--delay">
          <p class="home-card__eyebrow">Tarkib</p>

          <div class="home-chip-row">
            <span class="home-chip">ID: {{ currentMenu.id }}</span>
            <span class="home-chip">Ichki bo'limlar: {{ childMenus.length }}</span>
            <span class="home-chip">Fayllar: {{ documentItems.length }}</span>
            <span class="home-chip">Media: {{ mediaItems.length }}</span>
          </div>

          <p>
            Link berilmagan, lekin link sifatida belgilangan menyular alohida sahifada ochiladi. Link mavjud bo'lsa yangi tabda ochiladi.
          </p>
        </article>

        <section v-if="childMenus.length" class="home-section">
          <div class="home-section__header home-reveal">
            <div>
              <p class="home-kicker">Ichki bo'limlar</p>
              <h2>{{ menuLabel(currentMenu) }} tarkibi</h2>
            </div>
            <p class="home-section__text">
              Menu ichidagi elementlar shu blokda ko'rinadi. Link borlari yangi oynada, link berilmaganlari esa yana ichki sahifada ochiladi.
            </p>
          </div>

          <div class="menu-page-grid">
            <a
              v-for="item in childMenus.filter((child) => child.is_link && child.link)"
              :key="item.id"
              :href="item.link || '#'"
              class="menu-page-card home-reveal"
              target="_blank"
              rel="noreferrer"
            >
              <p class="home-card__eyebrow">Tashqi havola</p>
              <h3>{{ menuLabel(item) }}</h3>
              <p>{{ item.description || "Tashqi havola yangi oynada ochiladi." }}</p>
            </a>

            <NuxtLink
              v-for="item in childMenus.filter((child) => child.is_link && !child.link)"
              :key="item.id"
              :to="resolveMenuPagePath(item)"
              class="menu-page-card home-reveal"
            >
              <p class="home-card__eyebrow">Ichki sahifa</p>
              <h3>{{ menuLabel(item) }}</h3>
              <p>{{ item.description || "Ushbu bo'lim uchun alohida sahifa ochiladi." }}</p>
            </NuxtLink>

            <article
              v-for="item in childMenus.filter((child) => !child.is_link)"
              :key="item.id"
              class="menu-page-card home-reveal"
            >
              <p class="home-card__eyebrow">Katalog</p>
              <h3>{{ menuLabel(item) }}</h3>
              <p>{{ item.description || "Bu element hozircha faqat container sifatida ishlatiladi." }}</p>
            </article>
          </div>
        </section>

        <section v-if="documentItems.length" class="home-section home-section--soft">
          <div class="home-section__header home-reveal">
            <div>
              <p class="home-kicker">Resurslar</p>
              <h2>Menu fayllari</h2>
            </div>
            <p class="home-section__text">
              API orqali kelgan hujjatlar tanlangan menu detail sahifasida ko'rsatiladi.
            </p>
          </div>

          <div class="menu-page-assets">
            <a
              v-for="item in documentItems"
              :key="`doc-${item.id}`"
              :href="resolveUrl(item.url) || '#'"
              class="menu-page-asset home-reveal"
              target="_blank"
              rel="noreferrer"
            >
              <strong>{{ attachmentLabel(item) }}</strong>
              <span>Hujjatni ochish</span>
            </a>
          </div>
        </section>
      </div>

      <aside class="menu-page-layout__sidebar home-reveal">
        <div class="menu-page-sidebar">
          <p class="home-card__eyebrow">Navigatsiya</p>

          <div class="menu-page-sidebar__section">
            <span class="menu-page-sidebar__label">Parent menu</span>

            <NuxtLink
              v-if="parentMenu?.is_link && !parentMenu.link"
              :to="resolveMenuPagePath(parentMenu)"
              class="menu-page-sidebar__parent"
            >
              {{ menuLabel(parentMenu) }}
            </NuxtLink>

            <a
              v-else-if="parentMenu?.is_link && parentMenu.link"
              :href="parentMenu.link"
              class="menu-page-sidebar__parent"
              target="_blank"
              rel="noreferrer"
            >
              {{ menuLabel(parentMenu) }}
            </a>

            <div v-else class="menu-page-sidebar__parent menu-page-sidebar__parent--static">
              {{ parentMenu ? menuLabel(parentMenu) : 'Asosiy menyu' }}
            </div>
          </div>

          <div class="menu-page-sidebar__section">
            <span class="menu-page-sidebar__label">
              {{ parentMenu ? "Shu darajadagi menyular" : 'Asosiy menyular' }}
            </span>

            <div class="menu-page-sidebar__list">
              <a
                v-for="item in siblingMenus.filter((entry) => entry.is_link && entry.link)"
                :key="`sibling-external-${item.id}`"
                :href="item.link || '#'"
                class="menu-page-sidebar__item"
                :class="{ 'is-current': isCurrentMenu(item) }"
                target="_blank"
                rel="noreferrer"
              >
                {{ menuLabel(item) }}
              </a>

              <NuxtLink
                v-for="item in siblingMenus.filter((entry) => entry.is_link && !entry.link)"
                :key="`sibling-page-${item.id}`"
                :to="resolveMenuPagePath(item)"
                class="menu-page-sidebar__item"
                :class="{ 'is-current': isCurrentMenu(item) }"
              >
                {{ menuLabel(item) }}
              </NuxtLink>

              <div
                v-for="item in siblingMenus.filter((entry) => !entry.is_link)"
                :key="`sibling-static-${item.id}`"
                class="menu-page-sidebar__item menu-page-sidebar__item--static"
                :class="{ 'is-current': isCurrentMenu(item) }"
              >
                {{ menuLabel(item) }}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <AppFooter />
  </main>
</template>
