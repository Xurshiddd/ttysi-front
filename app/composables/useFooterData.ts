import type { Ref } from 'vue'
import type { Attachment, FrontendLocale } from '~/composables/useNavbarData'

export interface FooterSiteSetting {
  id: number
  icon: Attachment | null
}

export interface FooterSiteInformation {
  id: number
  name: string | null
  address: string | null
  emails: string[]
  phones: string[]
}

export interface FooterSocialNetwork {
  id: number
  title: string | null
  link: string | null
  order: number
  status: boolean
}

export interface FooterResponse {
  locale: FrontendLocale
  site_setting: FooterSiteSetting | null
  site_information: FooterSiteInformation | null
  social_networks: FooterSocialNetwork[]
}

const footerFallback: Record<FrontendLocale, FooterResponse> = {
  uz: {
    locale: 'uz',
    site_setting: {
      id: 1,
      icon: null
    },
    site_information: {
      id: 1,
      name: "Toshkent to'qimachilik va yengil sanoati instituti",
      address: 'Toshkent shahri, Mirobod tumani, Shohjahon ko\'chasi',
      emails: ['info@ttysi.uz', 'qabul@ttysi.uz'],
      phones: ['+998 71 253 06 06', '+998 71 253 09 09']
    },
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
    ]
  },
  ru: {
    locale: 'ru',
    site_setting: {
      id: 1,
      icon: null
    },
    site_information: {
      id: 1,
      name: 'TTYSI',
      address: 'Ташкент',
      emails: ['info@ttysi.uz', 'qabul@ttysi.uz'],
      phones: ['+998 71 253 06 06', '+998 71 253 09 09']
    },
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
    ]
  },
  en: {
    locale: 'en',
    site_setting: {
      id: 1,
      icon: null
    },
    site_information: {
      id: 1,
      name: 'TTYSI',
      address: 'Tashkent',
      emails: ['info@ttysi.uz', 'qabul@ttysi.uz'],
      phones: ['+998 71 253 06 06', '+998 71 253 09 09']
    },
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
    ]
  }
}

export function useFooterData(
  locale: Ref<FrontendLocale> | FrontendLocale = 'uz',
  options: { trackLoading?: boolean } = {}
) {
  const resolvedLocale = isRef(locale) ? locale : ref(locale)
  const config = useRuntimeConfig()
  const loader = import.meta.client ? useGlobalLoader() : null

  return useAsyncData(
    () => `frontend-footer-${resolvedLocale.value}`,
    async () => {
      const shouldTrack = import.meta.client && options.trackLoading !== false

      if (shouldTrack) loader?.start()

      try {
        return await $fetch<FooterResponse>('/api/frontend/footer', {
          baseURL: config.public.apiBase,
          query: {
            locale: resolvedLocale.value
          }
        })
      } catch {
        return footerFallback[resolvedLocale.value]
      } finally {
        if (shouldTrack) loader?.finish()
      }
    },
    {
      watch: [resolvedLocale],
      default: () => footerFallback[resolvedLocale.value]
    }
  )
}
