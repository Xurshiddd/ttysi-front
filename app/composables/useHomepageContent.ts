import type { Ref } from 'vue'
import type { Attachment, FrontendLocale } from '~/composables/useNavbarData'
import type {
  ActiveYouthItem,
  FacultyItem,
  GalleryItem,
  PartnerItem,
  PublishItem,
  SiteSocialLink,
  StatisticItem,
  UsefulLinkItem,
  VideoItem
} from '~/composables/useWelcomeData'

export interface HomeActionLink {
  label: string
  href: string
  external?: boolean
}

export interface HomeSocialLink {
  id: string
  label: string
  href: string
  badge: string
  external: boolean
}

export interface HomeStatisticCard {
  id: number
  label: string
  numericValue: number
  formattedValue: string
  badge: string
  detail: string
}

export interface HomeHeroSpotlight {
  title: string
  summary: string
  dateLabel: string
  imageUrl: string | null
  badge: string
}

export interface HomeStoryCard {
  id: number
  title: string
  summary: string
  dateLabel: string
  imageUrl: string | null
  badge: string
  href: string
  external: boolean
}

export interface HomeAnnouncementCard extends HomeStoryCard {
  priority: string
}

export interface HomeEventCard extends HomeStoryCard {
  dayLabel: string
  monthLabel: string
}

export interface HomeFacultyCard {
  id: number
  title: string
  summary: string
  location: string
  imageUrl: string | null
  badge: string
  metrics: Array<{ label: string; value: string }>
}

export interface HomeYouthCard {
  id: number
  title: string
  subtitle: string
  summary: string
  imageUrl: string | null
  badge: string
}

export interface HomeVideoCard {
  id: number
  title: string
  summary: string
  dateLabel: string
  imageUrl: string | null
  playback: 'iframe' | 'html5' | 'external'
  sourceUrl: string | null
  embedUrl: string | null
}

export interface HomeGalleryImage {
  id: string
  url: string
}

export interface HomeGalleryCard {
  id: number
  title: string
  summary: string
  dateLabel: string
  imageUrl: string | null
  countLabel: string
  images: HomeGalleryImage[]
}

export interface HomePartnerCard {
  id: number
  title: string
  href: string
  external: boolean
  imageUrl: string | null
  badge: string
}

export interface HomeUsefulLinkCard {
  id: number
  title: string
  href: string
  external: boolean
  badge: string
  note: string
}

export interface HomeFooterData {
  title: string
  address: string
  established: string | null
  emails: string[]
  phones: string[]
  socials: HomeSocialLink[]
  links: HomeUsefulLinkCard[]
}

const localeMap: Record<FrontendLocale, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US'
}

function normalizeText(value?: string | null) {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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

function toMonthAndDay(date: Date, locale: string) {
  return {
    dayLabel: new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date),
    monthLabel: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
  }
}

function toVideoEmbed(url?: string | null) {
  if (!url) return null

  const youtubeMatch =
    url.match(/[?&]v=([^&]+)/)?.[1] ||
    url.match(/youtu\.be\/([^?&/]+)/)?.[1] ||
    url.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1]

  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch}`

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)?.[1]
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch}`

  return /^https?:\/\//i.test(url) ? url : null
}

export function useHomepageContent(locale: Ref<FrontendLocale> | FrontendLocale = 'uz') {
  const resolvedLocale = isRef(locale) ? locale : ref(locale)
  const { data } = useWelcomeData(resolvedLocale)
  const { data: navbarData } = useNavbarData(resolvedLocale)
  const config = useRuntimeConfig()

  function sortActive<T extends { order?: number | null; status?: boolean | null }>(items?: T[] | null) {
    return [...(items ?? [])]
      .filter((item) => item && item.status !== false)
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
  }

  function excerpt(value?: string | null, max = 168) {
    const text = normalizeText(value)
    if (!text) return "Ma'lumot tez orada yangilanadi."
    return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text
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

  function formatDate(value?: string | null) {
    if (!value) return 'Yangilanmoqda'

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value

    return new Intl.DateTimeFormat(localeMap[resolvedLocale.value], {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(parsed)
  }

  function formatNumber(value?: number | string | null) {
    if (value === null || value === undefined || value === '') return '0'
    const number = Number(value)
    if (Number.isNaN(number)) return String(value)
    return new Intl.NumberFormat(localeMap[resolvedLocale.value]).format(number)
  }

  function phoneHref(value?: string | null) {
    return `tel:${(value ?? '').replace(/[^\d+]/g, '')}`
  }

  function isExternalUrl(url?: string | null) {
    return /^https?:\/\//i.test(url ?? '')
  }

  function statisticTitle(item: StatisticItem) {
    return item.title || "Ko'rsatkich"
  }

  function statisticValue(item: StatisticItem) {
    return item.value ?? item.quantity
  }

  function publishTitle(item: PublishItem) {
    return item.title || 'Yangilik'
  }

  function publishSummary(item: PublishItem, max = 160) {
    return excerpt(item.short_content || item.content || item.meta_description, max)
  }

  function publishDate(item: PublishItem) {
    return item.event_date || item.published_at
  }

  function facultyTitle(item: FacultyItem) {
    return item.name || item.title || 'Fakultet'
  }

  function youthTitle(item: ActiveYouthItem) {
    return item.title || item.full_name || 'Faol yosh'
  }

  function youthSummary(item: ActiveYouthItem) {
    return excerpt(item.short_content || item.description, 150)
  }

  function partnerTitle(item: PartnerItem) {
    return item.name || item.title || 'Hamkor'
  }

  function usefulTitle(item: UsefulLinkItem) {
    return item.title || 'Foydali havola'
  }

  function galleryTitle(item: GalleryItem) {
    return item.title || 'Fotogalereya'
  }

  function videoTitle(item: VideoItem) {
    return item.title || 'Video'
  }

  function videoImage(item: VideoItem) {
    return resolveAttachment(item.thumbnail || item.cover)
  }

  function videoSource(item: VideoItem) {
    return resolveUrl(item.video_url || item.video_source?.url || item.file?.url)
  }

  const siteInfo = computed(() => data.value?.site_information)
  const siteSetting = computed(() => navbarData.value?.site_setting)
  const news = computed(() => sortActive(data.value?.news))
  const announcements = computed(() => sortActive(data.value?.announcements))
  const otherEvents = computed(() => sortActive(data.value?.other_events))
  const faculties = computed(() => sortActive(data.value?.faculties))
  const statistics = computed(() => sortActive(data.value?.statistics))
  const activeYouths = computed(() => sortActive(data.value?.active_youths))
  const partners = computed(() => sortActive(data.value?.partners))
  const videos = computed(() => sortActive(data.value?.videos))
  const galleries = computed(() => sortActive(data.value?.galleries))
  const usefulLinks = computed(() => sortActive(data.value?.useful_links))
  const spotlight = computed(() => news.value[0] || announcements.value[0] || otherEvents.value[0] || null)

  const pageTitle = computed(
    () =>
      siteSetting.value?.name ||
      siteInfo.value?.name ||
      "Toshkent to'qimachilik va yengil sanoati instituti"
  )
  const siteImageUrl = computed(() => resolveAttachment(siteInfo.value?.image))
  const siteIconUrl = computed(() => resolveAttachment(siteSetting.value?.icon))

  const pageDescription = computed(
    () =>
      normalizeText(spotlight.value?.meta_description) ||
      (spotlight.value ? publishSummary(spotlight.value, 200) : '') ||
      "Toshkent to'qimachilik va yengil sanoati institutining rasmiy bosh sahifasi."
  )

  const pageKeywords = computed(() =>
    [
      pageTitle.value,
      'TTYSI',
      'institut',
      'qabul',
      ...news.value.slice(0, 3).map((item) => item.meta_keywords || publishTitle(item))
    ]
      .filter(Boolean)
      .join(', ')
  )

  const seoTitle = computed(
    () =>
      normalizeText(siteSetting.value?.meta_title) ||
      normalizeText(siteSetting.value?.name) ||
      pageTitle.value
  )

  const seoDescription = computed(
    () =>
      normalizeText(siteSetting.value?.meta_description) ||
      pageDescription.value
  )

  const seoKeywords = computed(
    () =>
      normalizeText(siteSetting.value?.meta_keywords) ||
      pageKeywords.value
  )

  const siteShortTitle = computed(
    () => normalizeText(siteSetting.value?.title) || normalizeText(siteSetting.value?.name) || 'TTYSI'
  )

  const heroChips = computed(() =>
    [
      siteInfo.value?.established_year ? `${siteInfo.value.established_year} yildan beri` : null,
      siteInfo.value?.address,
      siteInfo.value?.rector_name ? `Rektor: ${siteInfo.value.rector_name}` : null
    ].filter(Boolean) as string[]
  )

  const heroCtas = computed<HomeActionLink[]>(() => [
    {
      label: "Fakultetlarni ko'rish",
      href: '#faculties'
    },
    {
      label: 'Qabul va e`lonlar',
      href: '#announcements'
    }
  ])

  const socialItems = computed<HomeSocialLink[]>(() =>
    (siteInfo.value?.social_links ?? [])
      .filter((item) => Boolean(item?.url))
      .map((item: SiteSocialLink) => {
        const href = resolveUrl(item.url) || '#'

        return {
          id: item.key || initials(item.name, 'SN'),
          label: item.name || item.key || 'Social',
          href,
          badge: initials(item.name, initials(item.key, 'SN')),
          external: isExternalUrl(href)
        }
      })
  )

  const statCards = computed<HomeStatisticCard[]>(() =>
    statistics.value.map((item, index) => {
      const raw = statisticValue(item)
      const numericValue = Number(raw) || 0
      const label = statisticTitle(item)

      return {
        id: item.id,
        label,
        numericValue,
        formattedValue: formatNumber(raw),
        badge: typeof item.icon === 'string' && item.icon.trim()
          ? item.icon.trim().slice(0, 2).toUpperCase()
          : initials(label, `${index + 1}`.padStart(2, '0')),
        detail: index % 2 === 0 ? 'Aktiv ko`rsatkich' : 'Rasmiy statistika'
      }
    })
  )

  const heroSpotlight = computed<HomeHeroSpotlight | null>(() =>
    spotlight.value
      ? {
          title: publishTitle(spotlight.value),
          summary: publishSummary(spotlight.value, 170),
          dateLabel: formatDate(publishDate(spotlight.value)),
          imageUrl: resolveAttachment(spotlight.value.image) || siteImageUrl.value,
          badge: news.value[0]?.id === spotlight.value.id
            ? 'Top news'
            : announcements.value[0]?.id === spotlight.value.id
              ? 'Muhim'
              : 'Event'
        }
      : null
  )

  const seoImageUrl = computed(
    () => siteIconUrl.value || heroSpotlight.value?.imageUrl || siteImageUrl.value
  )

  const newsCards = computed<HomeStoryCard[]>(() =>
    news.value.map((item, index) => ({
      id: item.id,
      title: publishTitle(item),
      summary: publishSummary(item, index === 0 ? 176 : 142),
      dateLabel: formatDate(publishDate(item)),
      imageUrl: resolveAttachment(item.image),
      badge: index === 0 ? 'Asosiy' : 'Yangilik',
      href: '#news',
      external: false
    }))
  )

  const announcementCards = computed<HomeAnnouncementCard[]>(() =>
    announcements.value.map((item, index) => ({
      id: item.id,
      title: publishTitle(item),
      summary: publishSummary(item, 148),
      dateLabel: formatDate(publishDate(item)),
      imageUrl: resolveAttachment(item.image),
      badge: index === 0 ? 'Muhim' : 'E`lon',
      href: '#announcements',
      external: false,
      priority: index === 0 ? 'Primary notice' : 'Quick update'
    }))
  )

  const eventCards = computed<HomeEventCard[]>(() =>
    otherEvents.value.map((item, index) => {
      const rawDate = publishDate(item)
      const parsedDate = rawDate ? new Date(rawDate) : null
      const dateBits = parsedDate && !Number.isNaN(parsedDate.getTime())
        ? toMonthAndDay(parsedDate, localeMap[resolvedLocale.value])
        : { dayLabel: '--', monthLabel: 'Soon' }

      return {
        id: item.id,
        title: publishTitle(item),
        summary: publishSummary(item, 148),
        dateLabel: formatDate(rawDate),
        imageUrl: resolveAttachment(item.image),
        badge: index === 0 ? 'Featured' : 'Agenda',
        href: '#events',
        external: false,
        ...dateBits
      }
    })
  )

  const facultyCards = computed<HomeFacultyCard[]>(() =>
    faculties.value.map((item) => ({
      id: item.id,
      title: facultyTitle(item),
      summary: excerpt(item.description, 170),
      location: item.address || 'Kampus zonasi',
      imageUrl: resolveAttachment(item.image),
      badge: initials(facultyTitle(item), 'FK'),
      metrics: [
        { label: 'Kafedra', value: formatNumber(item.department_count) },
        { label: 'Ustoz', value: formatNumber(item.teacher_count) },
        { label: 'Talaba', value: formatNumber(item.student_count) }
      ]
    }))
  )

  const youthCards = computed<HomeYouthCard[]>(() =>
    activeYouths.value.map((item) => ({
      id: item.id,
      title: youthTitle(item),
      subtitle: item.group || 'Talabalar tashabbusi',
      summary: youthSummary(item),
      imageUrl: resolveAttachment(item.image),
      badge: initials(youthTitle(item), 'FY')
    }))
  )

  const videoCards = computed<HomeVideoCard[]>(() =>
    videos.value.map((item) => {
      const sourceUrl = videoSource(item)
      const embedUrl = toVideoEmbed(sourceUrl)
      const playback = sourceUrl?.match(/\.(mp4|webm|ogg)(\?|$)/i)
        ? 'html5'
        : embedUrl
          ? 'iframe'
          : 'external'

      return {
        id: item.id,
        title: videoTitle(item),
        summary: excerpt(item.video_source?.name || item.title, 144),
        dateLabel: formatDate(item.published_at),
        imageUrl: videoImage(item),
        playback,
        sourceUrl,
        embedUrl
      }
    })
  )

  const galleryCards = computed<HomeGalleryCard[]>(() =>
    galleries.value.map((item) => {
      const preview = resolveAttachment(item.image || item.preview_image)
      const images = item.images
        .map((image) => ({
          id: String(image.id),
          url: resolveAttachment(image)
        }))
        .filter((image): image is HomeGalleryImage => Boolean(image.url))

      return {
        id: item.id,
        title: galleryTitle(item),
        summary: images.length
          ? `${images.length} ta rasm bilan kampus hayoti va tadbirlar lavhalari.`
          : 'Fotojamlanma tez orada to`ldiriladi.',
        dateLabel: formatDate(item.published_at),
        imageUrl: preview || images[0]?.url || null,
        countLabel: `${Math.max(images.length, 1)} ta rasm`,
        images
      }
    })
  )

  const partnerCards = computed<HomePartnerCard[]>(() =>
    partners.value.map((item) => {
      const href = resolveUrl(item.link) || '#partners'

      return {
        id: item.id,
        title: partnerTitle(item),
        href,
        external: isExternalUrl(href),
        imageUrl: resolveAttachment(item.logo || item.image),
        badge: initials(partnerTitle(item), 'HM')
      }
    })
  )

  const usefulLinkCards = computed<HomeUsefulLinkCard[]>(() =>
    usefulLinks.value.map((item, index) => {
      const href = resolveUrl(item.link) || '#links'

      return {
        id: item.id,
        title: usefulTitle(item),
        href,
        external: isExternalUrl(href),
        badge: initials(usefulTitle(item), index === 0 ? 'Go' : 'LK'),
        note: index % 2 === 0 ? 'Tez kirish' : 'Rasmiy xizmat'
      }
    })
  )

  const footerData = computed<HomeFooterData>(() => ({
    title: pageTitle.value,
    address: siteInfo.value?.address || 'Toshkent shahri',
    established: siteInfo.value?.established_year ? `${siteInfo.value.established_year}` : null,
    emails: siteInfo.value?.emails?.length ? siteInfo.value.emails : ['info@ttysi.uz'],
    phones: siteInfo.value?.phones?.length ? siteInfo.value.phones : ['+998 71 253 06 06'],
    socials: socialItems.value,
    links: usefulLinkCards.value.slice(0, 6)
  }))

  return {
    data,
    siteSetting,
    siteInfo,
    news,
    announcements,
    otherEvents,
    faculties,
    statistics,
    activeYouths,
    partners,
    videos,
    galleries,
    usefulLinks,
    spotlight,
    siteIconUrl,
    siteImageUrl,
    siteShortTitle,
    pageTitle,
    pageDescription,
    pageKeywords,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImageUrl,
    heroChips,
    heroCtas,
    socialItems,
    statCards,
    heroSpotlight,
    newsCards,
    announcementCards,
    eventCards,
    facultyCards,
    youthCards,
    videoCards,
    galleryCards,
    partnerCards,
    usefulLinkCards,
    footerData,
    formatDate,
    formatNumber,
    resolveUrl,
    resolveAttachment,
    normalizeText,
    excerpt,
    initials,
    phoneHref
  }
}
