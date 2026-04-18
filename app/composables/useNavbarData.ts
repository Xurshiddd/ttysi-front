import type { Ref } from 'vue'

export type FrontendLocale = 'uz' | 'ru' | 'en'

export interface Attachment {
  id: number
  name: string
  url: string | null
  mime_type: string | null
  size: number | null
  order: number
  status: string
  is_primary: boolean
}

export interface SiteSetting {
  id: number
  status: boolean
  title: string | null
  name: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  icon: Attachment | null
}

export interface SystemLink {
  id: number
  title: string | null
  link: string
  order: number
  status: boolean
  icon: Attachment | null
}

export interface SocialNetwork {
  id: number
  title: string | null
  link: string | null
  order: number
  status: boolean
}

export interface MenuItem {
  id: number
  parent_id: number | null
  name: string | null
  title: string | null
  description: string | null
  order: number
  status: boolean
  is_link: boolean
  link: string | null
  settings: string | null
  media: Attachment[]
  documents: Attachment[]
  children: MenuItem[]
}

export interface NavbarResponse {
  locale: FrontendLocale
  site_setting: SiteSetting | null
  systems: SystemLink[]
  menus: MenuItem[]
  social_networks: SocialNetwork[]
}

const navbarFallback: Record<FrontendLocale, NavbarResponse> = {
  uz: {
    locale: 'uz',
    site_setting: {
      id: 1,
      status: true,
      title: 'TTYSI',
      name: "Toshkent to'qimachilik va yengil sanoati instituti",
      meta_title: 'TTYSI bosh sahifa',
      meta_description: 'Institut rasmiy sayti',
      meta_keywords: 'institut,ttysi,toqimachilik',
      icon: null
    },
    systems: [
      {
        id: 1,
        title: 'Moodle',
        link: 'https://example.com/moodle',
        order: 1,
        status: true,
        icon: null
      },
      {
        id: 2,
        title: 'Hemis',
        link: 'https://example.com/hemis',
        order: 2,
        status: true,
        icon: null
      }
    ],
    social_networks: [
      {
        id: 1,
        title: 'Instagram',
        link: 'https://instagram.com/ttysi',
        order: 1,
        status: true
      },
      {
        id: 2,
        title: 'Telegram',
        link: 'https://t.me/ttysi',
        order: 2,
        status: true
      },
      {
        id: 3,
        title: 'YouTube',
        link: 'https://youtube.com/@ttysi',
        order: 3,
        status: true
      },
      {
        id: 4,
        title: 'Facebook',
        link: 'https://facebook.com/ttysi',
        order: 4,
        status: true
      }
    ],
    menus: [
      {
        id: 1,
        parent_id: null,
        name: 'Institut',
        title: 'Institut',
        description: 'Institut haqida umumiy ma`lumot',
        order: 1,
        status: true,
        is_link: false,
        link: null,
        settings: 'mega',
        media: [],
        documents: [],
        children: [
          {
            id: 2,
            parent_id: 1,
            name: 'Tuzilma',
            title: 'Tuzilma',
            description: 'Institut boshqaruvi va bo`limlari',
            order: 1,
            status: true,
            is_link: true,
            link: '/structure',
            settings: null,
            media: [],
            documents: [],
            children: []
          },
          {
            id: 3,
            parent_id: 1,
            name: 'Fakultetlar',
            title: 'Fakultetlar',
            description: 'Ta`lim yo`nalishlari va fakultetlar',
            order: 2,
            status: true,
            is_link: true,
            link: '/faculties',
            settings: null,
            media: [],
            documents: [],
            children: []
          }
        ]
      },
      {
        id: 4,
        parent_id: null,
        name: 'Qabul',
        title: 'Qabul',
        description: 'Abituriyentlar uchun bo`lim',
        order: 2,
        status: true,
        is_link: false,
        link: null,
        settings: 'mega',
        media: [],
        documents: [],
        children: [
          {
            id: 5,
            parent_id: 4,
            name: 'Qabul nizomi',
            title: 'Qabul nizomi',
            description: 'Talablar va asosiy tartiblar',
            order: 1,
            status: true,
            is_link: true,
            link: '/admission',
            settings: null,
            media: [],
            documents: [],
            children: []
          },
          {
            id: 6,
            parent_id: 4,
            name: 'Kontrakt va grant',
            title: 'Kontrakt va grant',
            description: 'Moliyaviy imkoniyatlar va tartib',
            order: 2,
            status: true,
            is_link: true,
            link: '/tuition',
            settings: null,
            media: [],
            documents: [],
            children: []
          }
        ]
      },
      {
        id: 7,
        parent_id: null,
        name: 'Yangiliklar',
        title: 'Yangiliklar',
        description: 'So`nggi xabarlar',
        order: 3,
        status: true,
        is_link: true,
        link: '/news',
        settings: null,
        media: [],
        documents: [],
        children: []
      },
      {
        id: 8,
        parent_id: null,
        name: 'Aloqa',
        title: 'Aloqa',
        description: 'Bog`lanish ma`lumotlari',
        order: 4,
        status: true,
        is_link: true,
        link: '/contact',
        settings: null,
        media: [],
        documents: [],
        children: []
      }
    ]
  },
  ru: {
    locale: 'ru',
    site_setting: {
      id: 1,
      status: true,
      title: 'TTYSI',
      name: 'Ташкентский институт текстильной и легкой промышленности',
      meta_title: 'Главная TTYSI',
      meta_description: 'Официальный сайт института',
      meta_keywords: 'институт,ttysi,текстиль',
      icon: null
    },
    systems: [
      {
        id: 1,
        title: 'Moodle',
        link: 'https://example.com/moodle',
        order: 1,
        status: true,
        icon: null
      }
    ],
    social_networks: [
      {
        id: 1,
        title: 'Telegram',
        link: 'https://t.me/ttysi',
        order: 1,
        status: true
      },
      {
        id: 2,
        title: 'Instagram',
        link: 'https://instagram.com/ttysi',
        order: 2,
        status: true
      }
    ],
    menus: [
      {
        id: 1,
        parent_id: null,
        name: 'Институт',
        title: 'Институт',
        description: 'Общая информация',
        order: 1,
        status: true,
        is_link: false,
        link: null,
        settings: 'mega',
        media: [],
        documents: [],
        children: [
          {
            id: 2,
            parent_id: 1,
            name: 'Структура',
            title: 'Структура',
            description: 'Управление и подразделения',
            order: 1,
            status: true,
            is_link: true,
            link: '/structure',
            settings: null,
            media: [],
            documents: [],
            children: []
          }
        ]
      }
    ]
  },
  en: {
    locale: 'en',
    site_setting: {
      id: 1,
      status: true,
      title: 'TTYSI',
      name: 'Tashkent Institute of Textile and Light Industry',
      meta_title: 'TTYSI Home',
      meta_description: 'Official institute website',
      meta_keywords: 'institute,ttysi,textile',
      icon: null
    },
    systems: [
      {
        id: 1,
        title: 'Moodle',
        link: 'https://example.com/moodle',
        order: 1,
        status: true,
        icon: null
      }
    ],
    social_networks: [
      {
        id: 1,
        title: 'Telegram',
        link: 'https://t.me/ttysi',
        order: 1,
        status: true
      },
      {
        id: 2,
        title: 'Instagram',
        link: 'https://instagram.com/ttysi',
        order: 2,
        status: true
      }
    ],
    menus: [
      {
        id: 1,
        parent_id: null,
        name: 'Institute',
        title: 'Institute',
        description: 'General information',
        order: 1,
        status: true,
        is_link: false,
        link: null,
        settings: 'mega',
        media: [],
        documents: [],
        children: [
          {
            id: 2,
            parent_id: 1,
            name: 'Structure',
            title: 'Structure',
            description: 'Management and divisions',
            order: 1,
            status: true,
            is_link: true,
            link: '/structure',
            settings: null,
            media: [],
            documents: [],
            children: []
          }
        ]
      }
    ]
  }
}

export function useNavbarData(
  locale: Ref<FrontendLocale> | FrontendLocale = 'uz',
  options: { trackLoading?: boolean } = {}
) {
  const resolvedLocale = isRef(locale) ? locale : ref(locale)
  const config = useRuntimeConfig()
  const loader = import.meta.client ? useGlobalLoader() : null

  return useAsyncData(
    () => `frontend-navbar-${resolvedLocale.value}`,
    async () => {
      const shouldTrack = import.meta.client && options.trackLoading !== false

      if (shouldTrack) loader?.start()

      try {
        return await $fetch<NavbarResponse>('/api/frontend/navbar', {
          baseURL: config.public.apiBase,
          query: {
            locale: resolvedLocale.value
          }
        })
      } catch {
        return navbarFallback[resolvedLocale.value]
      } finally {
        if (shouldTrack) loader?.finish()
      }
    },
    {
      watch: [resolvedLocale],
      default: () => navbarFallback[resolvedLocale.value]
    }
  )
}
