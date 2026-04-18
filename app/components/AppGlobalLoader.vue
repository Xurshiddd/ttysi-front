<script setup lang="ts">
import type { FrontendLocale } from '~/composables/useNavbarData'
import type { FooterResponse } from '~/composables/useFooterData'

const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')
const { isVisible, pendingCount } = useGlobalLoader()
const config = useRuntimeConfig()

function resolveUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  const base = String(config.public.apiBase || '').replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

const { data } = useAsyncData(
  () => `frontend-loader-icon-${selectedLocale.value}`,
  async () => {
    try {
      return await $fetch<FooterResponse>('/api/frontend/footer', {
        baseURL: config.public.apiBase,
        query: {
          locale: selectedLocale.value
        }
      })
    } catch {
      return null
    }
  },
  {
    watch: [selectedLocale],
    default: () => null
  }
)

const loaderIcon = computed(() => resolveUrl(data.value?.site_setting?.icon?.url))
const loaderTitle = computed(() => data.value?.site_information?.name || 'TTYSI')

watch(
  isVisible,
  (next) => {
    if (!import.meta.client) return
    document.documentElement.dataset.loader = next ? 'true' : 'false'
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.documentElement.dataset.loader = 'false'
})
</script>

<template>
  <Transition name="loader-fade">
    <div v-if="isVisible" class="global-loader" role="status" aria-live="polite">
      <div class="global-loader__backdrop" />

      <div class="global-loader__card">
        <div class="global-loader__mark">
          <img
            v-if="loaderIcon"
            :src="loaderIcon"
            :alt="loaderTitle"
            class="global-loader__logo"
          >
          <span v-else class="global-loader__badge">TT</span>
        </div>

        <div class="global-loader__ring" aria-hidden="true" />

        <div class="global-loader__copy">
          <strong>{{ loaderTitle }}</strong>
          <span>
            {{ pendingCount > 0 ? "Ma'lumotlar yuklanmoqda..." : "Sahifa tayyorlanmoqda..." }}
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>
