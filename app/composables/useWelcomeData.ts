import type { Ref } from 'vue'
import type { Attachment, FrontendLocale } from '~/composables/useNavbarData'

export interface SiteSocialLink {
  key: string
  name: string
  url: string
  icon: Attachment | null
}

export interface SiteInformation {
  id: number
  name: string | null
  established_year: number | null
  rector_name: string | null
  address: string | null
  emails: string[]
  phones: string[]
  social_links: SiteSocialLink[]
  image: Attachment | null
}

export interface PublishItem {
  id: number
  title: string | null
  slug?: string | null
  short_content?: string | null
  content: string | null
  meta_keywords: string | null
  meta_description: string | null
  published_at: string | null
  event_date?: string | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface FacultyItem {
  id: number
  name?: string | null
  title: string | null
  slug?: string | null
  address: string | null
  description: string | null
  department_count: number | null
  teacher_count: number | null
  student_count: number | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface StatisticItem {
  id: number
  title: string | null
  value?: number | string | null
  quantity: number | string | null
  icon?: string | Attachment | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface ActiveYouthItem {
  id: number
  title?: string | null
  full_name: string | null
  group: string | null
  short_content?: string | null
  description: string | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface PartnerItem {
  id: number
  name?: string | null
  title: string | null
  link: string | null
  logo?: Attachment | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface VideoSource {
  type: string | null
  url: string | null
  mime_type: string | null
  name: string | null
}

export interface VideoItem {
  id: number
  title: string | null
  localized_media: boolean
  published_at: string | null
  order: number
  status: boolean
  thumbnail?: Attachment | null
  file?: Attachment | null
  video_url?: string | null
  cover: Attachment | null
  video_source: VideoSource | null
}

export interface GalleryItem {
  id: number
  title: string | null
  localized_media: boolean
  published_at: string | null
  order: number
  status: boolean
  image?: Attachment | null
  preview_image: Attachment | null
  images: Attachment[]
}

export interface UsefulLinkItem {
  id: number
  title: string | null
  link: string | null
  icon?: Attachment | null
  order: number
  status: boolean
  image: Attachment | null
}

export interface BannerItem {
  id: number
  title: string | null
  order: number
  status: boolean
  media_type?: 'image' | 'video' | string | null
  media: Attachment | Attachment[] | string | null
}

export interface WelcomeResponse {
  locale: FrontendLocale
  site_information: SiteInformation | null
  banners?: BannerItem[]
  news: PublishItem[]
  announcements: PublishItem[]
  other_events: PublishItem[]
  faculties: FacultyItem[]
  statistics: StatisticItem[]
  active_youths: ActiveYouthItem[]
  partners: PartnerItem[]
  videos: VideoItem[]
  galleries: GalleryItem[]
  useful_links: UsefulLinkItem[]
}

const baseWelcomeFallback: Omit<WelcomeResponse, 'locale'> = {
  site_information: {
    id: 1,
    name: "Toshkent to'qimachilik va yengil sanoati instituti",
    established_year: 1979,
    rector_name: "TTYSI rektori",
    address: 'Toshkent shahri, Mirobod tumani, Shohjahon ko\'chasi',
    emails: ['info@ttysi.uz', 'qabul@ttysi.uz'],
    phones: ['+998 71 253 06 06', '+998 71 253 09 09'],
    social_links: [
      {
        key: 'telegram',
        name: 'Telegram',
        url: 'https://t.me/ttysi',
        icon: null
      },
      {
        key: 'instagram',
        name: 'Instagram',
        url: 'https://instagram.com/ttysi',
        icon: null
      },
      {
        key: 'youtube',
        name: 'YouTube',
        url: 'https://youtube.com/@ttysi',
        icon: null
      }
    ],
    image: null
  },
  banners: [],
  news: [
    {
      id: 1,
      title: 'Texnologik laboratoriya yangi jihozlar bilan boyitildi',
      content: 'Talabalar uchun amaliy tajribani kuchaytiradigan tola, mato va pardoz jarayonlari bo\'yicha uskunalar ishga tushirildi.',
      meta_keywords: 'laboratoriya, tekstil, ta\'lim',
      meta_description: 'TTYSI laboratoriya bazasining yangilanishi.',
      published_at: '2026-04-11',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      title: 'Xalqaro hamkorlar bilan qo\'shma loyihalar soni oshdi',
      content: 'Institutning ilmiy va amaliy yo\'nalishlari bo\'yicha hamkor universitetlar hamda ishlab chiqaruvchilar bilan yangi dasturlar boshlanmoqda.',
      meta_keywords: 'hamkorlik, loyiha',
      meta_description: 'Hamkorlik loyihalari kengaymoqda.',
      published_at: '2026-04-09',
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      title: 'Talabalar dizayn ishlanmalari sanoat ekspertlariga taqdim etildi',
      content: 'Moda va sanoat dizayni yo\'nalishlarida tahsil olayotgan talabalar o\'z kolleksiyalarini ekspertlar oldida namoyish etdi.',
      meta_keywords: 'dizayn, moda',
      meta_description: 'Talabalar kolleksiyasi taqdimoti.',
      published_at: '2026-04-07',
      order: 3,
      status: true,
      image: null
    }
  ],
  announcements: [
    {
      id: 10,
      title: '2026-2027 o\'quv yili uchun qabul bo\'yicha eslatma',
      content: 'Abituriyentlar onlayn ariza topshirishdan oldin hujjatlar ro\'yxatini va yo\'nalishlar kesimidagi talablarni tekshirib chiqishlari so\'raladi.',
      meta_keywords: 'qabul, eslatma',
      meta_description: 'Qabul bo\'yicha muhim eslatma.',
      published_at: '2026-04-12',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 11,
      title: 'Stipendiya hujjatlari qabul muddati uzaytirildi',
      content: 'Iqtidorli talabalar uchun qo\'shimcha tanlov hujjatlari haftaning oxirigacha qabul qilinadi.',
      meta_keywords: 'stipendiya',
      meta_description: 'Stipendiya tanlovi muddati.',
      published_at: '2026-04-10',
      order: 2,
      status: true,
      image: null
    }
  ],
  other_events: [
    {
      id: 20,
      title: 'Green campus haftaligi',
      content: 'Ekologik tashabbuslar, qayta ishlash, yashil texnologiyalar va talabalar loyihalari haftaligi bo\'lib o\'tadi.',
      meta_keywords: 'green campus',
      meta_description: 'Ekologik tashabbuslar haftaligi.',
      published_at: '2026-04-13',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 21,
      title: 'Textile innovation forum',
      content: 'Sanoat yetakchilari, yosh tadqiqotchilar va talabalar ishtirokida ochiq forum tashkil etiladi.',
      meta_keywords: 'forum',
      meta_description: 'Textile innovation forum.',
      published_at: '2026-04-08',
      order: 2,
      status: true,
      image: null
    }
  ],
  faculties: [
    {
      id: 1,
      title: 'Tekstil muhandisligi fakulteti',
      address: '1-bino',
      description: 'Toladan tayyor mahsulotgacha bo\'lgan texnologik jarayonlarni sanoat ehtiyoji bilan uyg\'unlashtiruvchi fakultet.',
      department_count: 6,
      teacher_count: 72,
      student_count: 1280,
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      title: 'Moda va dizayn fakulteti',
      address: '2-bino',
      description: 'Kreativ fikrlash, libos dizayni, kompozitsiya va kolleksiya yaratish yo\'nalishlari bo\'yicha ijodiy muhit.',
      department_count: 4,
      teacher_count: 48,
      student_count: 930,
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      title: 'Raqamli texnologiyalar fakulteti',
      address: '3-bino',
      description: 'Axborot tizimlari, avtomatlashtirish va analitika orqali ishlab chiqarish jarayonlarini modernizatsiya qiluvchi fakultet.',
      department_count: 5,
      teacher_count: 61,
      student_count: 1015,
      order: 3,
      status: true,
      image: null
    },
    {
      id: 4,
      title: 'Biznes va menejment fakulteti',
      address: '4-bino',
      description: 'Yengil sanoat iqtisodiyoti, boshqaruv, logistika va xalqaro savdo bo\'yicha amaliy bilim beruvchi yo\'nalishlar.',
      department_count: 3,
      teacher_count: 37,
      student_count: 690,
      order: 4,
      status: true,
      image: null
    }
  ],
  statistics: [
    {
      id: 1,
      title: 'Talabalar',
      quantity: 12000,
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      title: 'O\'qituvchilar',
      quantity: 850,
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      title: 'Hamkor tashkilotlar',
      quantity: 140,
      order: 3,
      status: true,
      image: null
    },
    {
      id: 4,
      title: 'Laboratoriyalar',
      quantity: 28,
      order: 4,
      status: true,
      image: null
    }
  ],
  active_youths: [
    {
      id: 1,
      full_name: 'Madinabonu Qodirova',
      group: 'DTM-21',
      description: 'Startup va innovatsion loyihalar bo\'yicha talabalar lideri.',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      full_name: 'Ibrohim Ergashev',
      group: 'TM-31',
      description: 'Ilmiy to\'garaklar va texnologik prototiplar bilan faol shug\'ullanadi.',
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      full_name: 'Nilufar Tursunova',
      group: 'MD-22',
      description: 'Madaniy tadbirlar va ijodiy loyihalarning tashabbuskori.',
      order: 3,
      status: true,
      image: null
    }
  ],
  partners: [
    {
      id: 1,
      title: 'Textile Research Hub',
      link: 'https://example.com/partner-1',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      title: 'Fashion Tech Alliance',
      link: 'https://example.com/partner-2',
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      title: 'Innovative Weaving Lab',
      link: 'https://example.com/partner-3',
      order: 3,
      status: true,
      image: null
    },
    {
      id: 4,
      title: 'Digital Silk Academy',
      link: 'https://example.com/partner-4',
      order: 4,
      status: true,
      image: null
    }
  ],
  videos: [
    {
      id: 1,
      title: 'Institut hayoti: bir kunlik campus ritmi',
      localized_media: false,
      published_at: '2026-04-08',
      order: 1,
      status: true,
      cover: null,
      video_source: {
        type: 'link',
        url: 'https://example.com/video-campus',
        mime_type: null,
        name: null
      }
    },
    {
      id: 2,
      title: 'Laboratoriyalar bo\'ylab video sayohat',
      localized_media: false,
      published_at: '2026-04-06',
      order: 2,
      status: true,
      cover: null,
      video_source: {
        type: 'link',
        url: 'https://example.com/video-lab',
        mime_type: null,
        name: null
      }
    }
  ],
  galleries: [
    {
      id: 1,
      title: 'Talabalar dizayn ko\'rgazmasi',
      localized_media: false,
      published_at: '2026-04-05',
      order: 1,
      status: true,
      preview_image: null,
      images: []
    },
    {
      id: 2,
      title: 'Yoshlar festivali va kampus hayoti',
      localized_media: false,
      published_at: '2026-04-03',
      order: 2,
      status: true,
      preview_image: null,
      images: []
    }
  ],
  useful_links: [
    {
      id: 1,
      title: 'Elektron kutubxona',
      link: 'https://example.com/library',
      order: 1,
      status: true,
      image: null
    },
    {
      id: 2,
      title: 'Qabul portali',
      link: 'https://example.com/admission',
      order: 2,
      status: true,
      image: null
    },
    {
      id: 3,
      title: 'Akademik taqvim',
      link: 'https://example.com/calendar',
      order: 3,
      status: true,
      image: null
    },
    {
      id: 4,
      title: 'Talabalar xizmatlari',
      link: 'https://example.com/services',
      order: 4,
      status: true,
      image: null
    }
  ]
}

function cloneFallback(locale: FrontendLocale): WelcomeResponse {
  const suffix = locale === 'ru' ? 'TTYSI' : locale === 'en' ? 'TTYSI' : null

  return {
    locale,
    ...baseWelcomeFallback,
    site_information: {
      ...baseWelcomeFallback.site_information,
      name: suffix || baseWelcomeFallback.site_information.name
    },
    banners: [...(baseWelcomeFallback.banners ?? [])],
    news: baseWelcomeFallback.news.map((item) => ({ ...item })),
    announcements: baseWelcomeFallback.announcements.map((item) => ({ ...item })),
    other_events: baseWelcomeFallback.other_events.map((item) => ({ ...item })),
    faculties: baseWelcomeFallback.faculties.map((item) => ({ ...item })),
    statistics: baseWelcomeFallback.statistics.map((item) => ({ ...item })),
    active_youths: baseWelcomeFallback.active_youths.map((item) => ({ ...item })),
    partners: baseWelcomeFallback.partners.map((item) => ({ ...item })),
    videos: baseWelcomeFallback.videos.map((item) => ({
      ...item,
      video_source: item.video_source ? { ...item.video_source } : null
    })),
    galleries: baseWelcomeFallback.galleries.map((item) => ({
      ...item,
      images: item.images.map((image) => ({ ...image }))
    })),
    useful_links: baseWelcomeFallback.useful_links.map((item) => ({ ...item }))
  }
}

const welcomeFallback: Record<FrontendLocale, WelcomeResponse> = {
  uz: cloneFallback('uz'),
  ru: cloneFallback('ru'),
  en: cloneFallback('en')
}

export function useWelcomeData(
  locale: Ref<FrontendLocale> | FrontendLocale = 'uz',
  options: { trackLoading?: boolean } = {}
) {
  const resolvedLocale = isRef(locale) ? locale : ref(locale)
  const config = useRuntimeConfig()
  const loader = import.meta.client ? useGlobalLoader() : null

  return useAsyncData(
    () => `frontend-welcome-${resolvedLocale.value}`,
    async () => {
      const shouldTrack = import.meta.client && options.trackLoading !== false

      if (shouldTrack) loader?.start()

      try {
        return await $fetch<WelcomeResponse>('/api/frontend/welcome', {
          baseURL: config.public.apiBase,
          query: {
            locale: resolvedLocale.value
          }
        })
      } catch {
        return welcomeFallback[resolvedLocale.value]
      } finally {
        if (shouldTrack) loader?.finish()
      }
    },
    {
      watch: [resolvedLocale],
      default: () => welcomeFallback[resolvedLocale.value]
    }
  )
}
