<script setup lang="ts">
import type { FrontendLocale } from '~/composables/useNavbarData'

const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')
const pageRoot = ref<HTMLElement | null>(null)

const {
  siteInfo,
  siteIconUrl,
  siteShortTitle,
  heroBanner,
  pageTitle,
  pageDescription,
  pageKeywords,
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImageUrl,
  statCards,
  newsCards,
  announcementCards,
  eventCards,
  facultyCards,
  youthCards,
  videoCards,
  galleryCards,
  partnerCards,
  usefulLinkCards,
  footerData
} = useHomepageContent(selectedLocale)

const { registerReveals } = useLandingMotion()
const requestUrl = useRequestURL()

const newsAction = computed(() => ({ label: "Barcha yangiliklar", href: '#news' }))
const announcementAction = computed(() => ({ label: "Barcha e'lonlar", href: '#announcements' }))
const eventAction = computed(() => ({ label: 'Tadbirlar kalendari', href: '#events' }))
const facultyAction = computed(() => ({ label: 'Yo`nalishlar bilan tanishish', href: '#faculties' }))
const youthAction = computed(() => ({ label: 'Talabalar hayoti', href: '#youth' }))
const mediaAction = computed(() => ({ label: 'Media bo`limi', href: '#media' }))
const partnerAction = computed(() => ({ label: 'Hamkorlar bilan ishlash', href: '#partners' }))
const usefulAction = computed(() => ({ label: 'Barcha servislar', href: '#links' }))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  keywords: () => seoKeywords.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => seoImageUrl.value || undefined,
  ogType: 'website',
  ogSiteName: () => siteShortTitle.value,
  ogLocale: () => selectedLocale.value === 'uz' ? 'uz_UZ' : selectedLocale.value === 'ru' ? 'ru_RU' : 'en_US',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImageUrl.value || undefined,
  twitterCard: () => seoImageUrl.value ? 'summary_large_image' : 'summary'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: requestUrl.href
    },
    ...(siteIconUrl.value
      ? [
          {
            rel: 'icon',
            href: siteIconUrl.value
          },
          {
            rel: 'apple-touch-icon',
            href: siteIconUrl.value
          }
        ]
      : [])
  ]
}))

let stopRevealObserver: (() => void) | null = null

onMounted(() => {
  stopRevealObserver = registerReveals(pageRoot.value)
})

onBeforeUnmount(() => {
  stopRevealObserver?.()
})
</script>

<template>
  <main ref="pageRoot" class="page-shell landing-home">
    <AppNavbar />

    <HomeHeroSection
      :title="heroBanner?.title || pageTitle"
      :established-year="siteInfo?.established_year || null"
      :media-type="heroBanner?.mediaType || null"
      :media-url="heroBanner?.mediaUrl || null"
    />

    <HomeHeroFeedSection
      :news="newsCards"
      :announcements="announcementCards"
      :events="eventCards"
    />

    <HomeStatisticsSection :items="statCards" />
    <HomeNewsSection :items="newsCards" :action="newsAction" />
    <HomeAnnouncementsSection :items="announcementCards" :action="announcementAction" />
    <HomeEventsSection :items="eventCards" :action="eventAction" />
    <HomeFacultiesSection :items="facultyCards" :action="facultyAction" />
    <HomeYouthSection :items="youthCards" :action="youthAction" />
    <HomeMediaSection :videos="videoCards" :galleries="galleryCards" :action="mediaAction" />
    <HomePartnersSection :items="partnerCards" :action="partnerAction" />
    <HomeUsefulLinksSection :items="usefulLinkCards" :action="usefulAction" />
    <HomeSiteFooter :data="footerData" />
  </main>
</template>
