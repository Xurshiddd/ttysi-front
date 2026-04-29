<script setup lang="ts">
import type { FrontendLocale, MenuItem, SocialNetwork } from '~/composables/useNavbarData'

const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')
const { data } = useNavbarData(selectedLocale)
const route = useRoute()

const openMenuId = ref<number | null>(null)
const menuShell = ref<HTMLElement | null>(null)
const systemsViewport = ref<HTMLElement | null>(null)
const systemsTrack = ref<HTMLElement | null>(null)
const systemsGroup = ref<HTMLElement | null>(null)
const menuPlaceholderHeight = ref(0)
const isMenuPinned = ref(false)
const menuPinnedTop = ref(10)
const menuPinnedLeft = ref(0)
const menuPinnedWidth = ref(0)
const menuOriginalTop = ref(0)
const hasSystemsOverflow = ref(false)
const systemsStartOffset = ref(0)
const systemsLoopDistance = ref(0)
const systemsMarqueeDuration = ref(18)
const utilityNow = useState<string>('navbar-utility-now', () => new Date().toISOString())
const viewportWidth = ref(Number.POSITIVE_INFINITY)
const isMobileMenuOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null

function cancelClose() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = null
}

function openMenu(id: number) {
  cancelClose()
  openMenuId.value = id
}

function scheduleClose(delayMs = 320) {
  cancelClose()
  closeTimer = setTimeout(() => {
    openMenuId.value = null
  }, delayMs)
}

function toggleMenu(id: number) {
  cancelClose()
  openMenuId.value = openMenuId.value === id ? null : id
}

function updateViewportState() {
  viewportWidth.value = window.innerWidth
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value

  if (!isMobileMenuOpen.value) {
    openMenuId.value = null
  }
}

function closeMobileMenu() {
  if (!isCompactNav.value) return

  isMobileMenuOpen.value = false
  openMenuId.value = null
}

function onItemFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  const current = event.currentTarget as HTMLElement | null
  if (next && current && current.contains(next)) return
  scheduleClose(220)
}

const sortedMenus = computed(() =>
  [...(data.value?.menus ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
)

const activeSystems = computed(() =>
  [...(data.value?.systems ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
)

const activeSocials = computed(() =>
  [...(data.value?.social_networks ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
)

const siteTitle = computed(() => data.value?.site_setting?.title || 'TTYSI')
const siteName = computed(
  () => data.value?.site_setting?.name || "Toshkent to'qimachilik va yengil sanoati instituti"
)
const siteLogo = computed(() => data.value?.site_setting?.icon?.url || null)
const isCompactNav = computed(() => viewportWidth.value <= 760)
const showExpandedNav = computed(() => !isCompactNav.value || isMobileMenuOpen.value)

function resolveMenuHref(item: MenuItem) {
  return item.link || resolveMenuPagePath(item)
}

function systemCode(title: string | null) {
  return (title || 'TT')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase() || 'TT'
}

function systemLabel(title: string | null) {
  return title || 'Tizim'
}

function socialLabel(item: SocialNetwork) {
  return item.title || 'Social'
}

function socialPlatform(item: SocialNetwork) {
  const value = `${item.title || ''} ${item.link || ''}`.toLowerCase()

  if (value.includes('instagram')) return 'instagram'
  if (value.includes('telegram') || value.includes('t.me')) return 'telegram'
  if (value.includes('youtube') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('facebook') || value.includes('fb.com')) return 'facebook'
  if (value.includes('twitter') || value.includes('x.com')) return 'x'

  return 'generic'
}

function syncSystemsCarouselState() {
  if (isCompactNav.value && !isMobileMenuOpen.value) {
    hasSystemsOverflow.value = false
    systemsStartOffset.value = 0
    systemsLoopDistance.value = 0
    return
  }

  const viewport = systemsViewport.value
  const group = systemsGroup.value
  const track = systemsTrack.value
  if (!viewport || !group) return

  const groupWidth = group.scrollWidth
  const viewportWidth = viewport.clientWidth
  const gap = track
    ? Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0') || 0
    : 0

  hasSystemsOverflow.value = groupWidth > viewportWidth + 4
  systemsStartOffset.value = Math.min(0, Math.round((viewportWidth - groupWidth) / 2))
  systemsLoopDistance.value = Math.round(groupWidth + gap)
  systemsMarqueeDuration.value = Math.max(16, Math.round((groupWidth + gap) / 22))
}

const utilityLocaleParts = {
  uz: {
    weekdays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
    months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr']
  },
  ru: {
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  },
  en: {
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
} as const

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

function formatUtilityTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const locale = selectedLocale.value
  const parts = utilityLocaleParts[locale] ?? utilityLocaleParts.uz
  const weekday = parts.weekdays[date.getDay()] ?? parts.weekdays[0]
  const month = parts.months[date.getMonth()] ?? parts.months[0]
  const time = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`

  if (locale === 'en') {
    return `${date.getFullYear()} ${month.slice(0, 3)} ${pad2(date.getDate())}, ${weekday.slice(0, 3)} ${time}`
  }

  return `${weekday}, ${pad2(date.getDate())}-${month}, ${date.getFullYear()}, ${time}`
}

function syncMenuPinState() {
  const element = menuShell.value
  if (!element) return

  if (isCompactNav.value || !showExpandedNav.value) {
    isMenuPinned.value = false
    document.documentElement.style.setProperty('--navbar-menu-offset', '0px')
    return
  }

  const rect = element.getBoundingClientRect()
  menuPinnedTop.value = window.innerWidth <= 760 ? 8 : 10
  menuPinnedLeft.value = rect.left
  menuPinnedWidth.value = rect.width
  menuPlaceholderHeight.value = rect.height

  if (!isMenuPinned.value) {
    menuOriginalTop.value = rect.top + window.scrollY
  }

  isMenuPinned.value = window.scrollY >= menuOriginalTop.value - menuPinnedTop.value
  document.documentElement.style.setProperty(
    '--navbar-menu-offset',
    isMenuPinned.value ? `${menuPlaceholderHeight.value + menuPinnedTop.value + 8}px` : '0px'
  )
}

function onScroll() {
  syncMenuPinState()
}

function onResize() {
  updateViewportState()
  isMenuPinned.value = false
  requestAnimationFrame(() => {
    syncMenuPinState()
    syncSystemsCarouselState()
  })
}

const menuShellStyle = computed(() =>
  isMenuPinned.value
    ? {
        top: `${menuPinnedTop.value}px`,
        left: `${menuPinnedLeft.value}px`,
        width: `${menuPinnedWidth.value}px`
      }
    : undefined
)

const systemsTrackStyle = computed(() =>
  hasSystemsOverflow.value
    ? {
        '--systems-start-offset': `${systemsStartOffset.value}px`,
        '--systems-loop-distance': `${systemsLoopDistance.value}px`,
        '--systems-marquee-duration': `${systemsMarqueeDuration.value}s`
      }
    : undefined
)

onMounted(() => {
  updateViewportState()
  syncMenuPinState()
  syncSystemsCarouselState()
  clockTimer = setInterval(() => {
    utilityNow.value = new Date().toISOString()
  }, 1000 * 30)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.documentElement.style.setProperty('--navbar-menu-offset', '0px')
})

watch(activeSystems, () => {
  nextTick(() => {
    syncSystemsCarouselState()
  })
})

watch(showExpandedNav, (isVisible) => {
  nextTick(() => {
    syncMenuPinState()
    if (isVisible) {
      syncSystemsCarouselState()
    }
  })
})

watch(isCompactNav, (isCompact) => {
  openMenuId.value = null

  if (!isCompact) {
    isMobileMenuOpen.value = false
  }

  nextTick(() => {
    syncMenuPinState()
    syncSystemsCarouselState()
  })
})

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  }
)
</script>

<template>
  <header class="navbar">
    <div class="navbar__utility">
      <span class="navbar__utility-time">{{ formatUtilityTime(utilityNow) }}</span>

      <a href="#" class="navbar__legacy-link">Saytning eski talqini</a>

      <div class="navbar__social-panel">
        <span class="navbar__panel-label">Biz ijtimoiy tarmoqlarda:</span>

        <div class="navbar__socials">
          <a
            v-for="item in activeSocials"
            :key="item.id"
            :href="item.link || '#'"
            class="navbar__social-link"
            :aria-label="socialLabel(item)"
            :data-tooltip="socialLabel(item)"
            target="_blank"
            rel="noreferrer"
          >
            <span class="navbar__social-icon" aria-hidden="true">
              <svg v-if="socialPlatform(item) === 'instagram'" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.25" stroke="currentColor" stroke-width="1.9" />
                <circle cx="12" cy="12" r="3.6" stroke="currentColor" stroke-width="1.9" />
                <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
              </svg>
              <svg v-else-if="socialPlatform(item) === 'telegram'" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M20.2 5.1 17.5 18a1 1 0 0 1-1.5.6l-4.1-3-2.1 2.1a.9.9 0 0 1-1.5-.5l-.6-4.1L4.5 11a1 1 0 0 1 .1-1.9L19 4.3a1 1 0 0 1 1.2.8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="m9.1 13.2 8.5-7.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
              <svg v-else-if="socialPlatform(item) === 'youtube'" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M21 12.1c0 2-.2 3.4-.5 4.2a2.7 2.7 0 0 1-1.6 1.6c-.9.3-3.6.5-6.9.5s-6-.2-6.9-.5a2.7 2.7 0 0 1-1.6-1.6C3.2 15.5 3 14 3 12.1s.2-3.4.5-4.2a2.7 2.7 0 0 1 1.6-1.6c.9-.3 3.6-.5 6.9-.5s6 .2 6.9.5a2.7 2.7 0 0 1 1.6 1.6c.3.8.5 2.2.5 4.2Z" stroke="currentColor" stroke-width="1.7" />
                <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
              </svg>
              <svg v-else-if="socialPlatform(item) === 'facebook'" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M13.4 20v-6.1h2.4l.4-2.7h-2.8V9.5c0-.8.3-1.5 1.6-1.5h1.3V5.6c-.2 0-.9-.1-1.8-.1-2.7 0-4.4 1.6-4.4 4.6v1.1H8v2.7h2.1V20h3.3Z" fill="currentColor" />
              </svg>
              <svg v-else-if="socialPlatform(item) === 'x'" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M5 5h3.5l3.7 5.2L16.7 5H19l-5.7 6.4L19.5 19H16l-4-5.6L7 19H4.7l6.1-6.9L5 5Z" fill="currentColor" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7" />
                <path d="M4.5 12h15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M12 3.8c2.2 2.4 3.3 5.1 3.3 8.2s-1.1 5.8-3.3 8.2c-2.2-2.4-3.3-5.1-3.3-8.2s1.1-5.8 3.3-8.2Z" stroke="currentColor" stroke-width="1.7" />
              </svg>
            </span>
          </a>
        </div>

        <AppA11ySettings />
        <AppTtsSelectionTrigger />
      </div>
    </div>

    <div class="navbar__main">
      <div class="navbar__main-head">
        <NuxtLink class="navbar__brand" to="/" @click="closeMobileMenu">
          <img
            v-if="siteLogo"
            :src="siteLogo"
            :alt="siteTitle"
            class="navbar__logo"
          >
          <span v-else class="navbar__badge">{{ siteTitle.slice(0, 2) }}</span>

          <span class="navbar__brand-copy">
            <strong>{{ siteName }}</strong>
            <small>{{ siteTitle }} raqamli platformasi</small>
          </span>
        </NuxtLink>

        <button
          v-if="isCompactNav"
          type="button"
          class="navbar__mobile-toggle"
          :aria-expanded="String(showExpandedNav)"
          aria-label="Navigatsiyani ochish yoki yopish"
          @click="toggleMobileMenu"
        >
          <span class="navbar__mobile-toggle-line" />
          <span class="navbar__mobile-toggle-line" />
          <span class="navbar__mobile-toggle-line" />
        </button>
      </div>

      <section
        v-show="showExpandedNav"
        class="navbar__systems-panel p-30"
        aria-label="Tizimlar va tezkor havolalar"
      >
        <div class="navbar__systems-strip">
          <div class="navbar__systems-lane">
            <div
              ref="systemsViewport"
              class="navbar__systems-carousel"
              :class="{ 'is-animated': hasSystemsOverflow }"
            >
              <div
                ref="systemsTrack"
                class="navbar__systems-track"
                :style="systemsTrackStyle"
              >
        <div
  ref="systemsWrapper"
  class="navbar__systems-wrapper"
  :class="{ 'is-animated': hasSystemsOverflow }"
>
  <div ref="systemsGroup" class="navbar__systems-track">
    <div class="navbar__systems-group">
      <a
        v-for="system in activeSystems"
        :key="system.id"
        :href="system.link"
        class="navbar__system-card"
        :aria-label="systemLabel(system.title)"
        :data-tooltip="systemLabel(system.title)"
        target="_blank"
        rel="noreferrer"
        @click="closeMobileMenu"
      >
        <img
          v-if="system.icon?.url"
          :src="system.icon.url"
          :alt="system.title || 'System'"
          class="navbar__system-image"
        >
        <span v-else class="navbar__system-icon">
          {{ systemCode(system.title) }}
        </span>
      </a>
    </div>

    <div
      v-if="hasSystemsOverflow"
      class="navbar__systems-group navbar__systems-group--duplicate"
      aria-hidden="true"
    >
      <a
        v-for="system in activeSystems"
        :key="`${system.id}-duplicate`"
        :href="system.link"
        class="navbar__system-card"
        tabindex="-1"
        :data-tooltip="systemLabel(system.title)"
        target="_blank"
        rel="noreferrer"
        @click="closeMobileMenu"
      >
        <img
          v-if="system.icon?.url"
          :src="system.icon.url"
          :alt="system.title || 'System'"
          class="navbar__system-image"
        >
        <span v-else class="navbar__system-icon">
          {{ systemCode(system.title) }}
        </span>
      </a>
    </div>
  </div>
</div>
              </div>
            </div>
          </div>

          <!-- <span class="navbar__systems-divider" aria-hidden="true" /> -->

          <a href="#" class="navbar__quick-link navbar__quick-link--primary" @click="closeMobileMenu">
            <span class="navbar__quick-link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M14 5h5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 14 19 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>Virtual qabulxona</span>
          </a>

          <span class="navbar__systems-divider navbar__systems-divider--end" aria-hidden="true" />
        </div>
      </section>
    </div>

    <div
      v-if="isMenuPinned"
      class="navbar__menu-shell-placeholder"
      :style="{ height: `${menuPlaceholderHeight}px` }"
      aria-hidden="true"
    />

    <div
      v-show="showExpandedNav"
      ref="menuShell"
      class="navbar__menu-shell"
      :class="{ 'is-pinned': isMenuPinned }"
      :style="menuShellStyle"
    >
      <nav class="navbar__menu" aria-label="Main navigation">
        <div
          v-for="item in sortedMenus"
          :key="item.id"
          class="navbar__menu-item"
          :class="{ 'is-open': openMenuId === item.id }"
          @mouseenter="openMenu(item.id)"
          @mouseleave="scheduleClose()"
          @focusin="openMenu(item.id)"
          @focusout="onItemFocusOut"
        >
          <a
            v-if="item.is_link && item.link"
            :href="resolveMenuHref(item)"
            class="navbar__menu-link"
            :aria-haspopup="item.children.length ? 'menu' : undefined"
            :aria-expanded="item.children.length ? String(openMenuId === item.id) : undefined"
            target="_blank"
            rel="noreferrer"
            @click="closeMobileMenu"
          >
            {{ menuLabel(item) }}
          </a>

          <NuxtLink
            v-else-if="item.is_link"
            :to="resolveMenuHref(item)"
            class="navbar__menu-link"
            :aria-haspopup="item.children.length ? 'menu' : undefined"
            :aria-expanded="item.children.length ? String(openMenuId === item.id) : undefined"
            @click="closeMobileMenu"
          >
            {{ menuLabel(item) }}
          </NuxtLink>

          <button
            v-else
            type="button"
            class="navbar__menu-link navbar__menu-link--button"
            :aria-haspopup="item.children.length ? 'menu' : undefined"
            :aria-expanded="item.children.length ? String(openMenuId === item.id) : undefined"
            @click="item.children.length ? toggleMenu(item.id) : undefined"
            @keydown.esc="openMenuId = null"
          >
            {{ menuLabel(item) }}
          </button>

          <div
            v-if="item.children.length"
            v-show="openMenuId === item.id"
            class="navbar__dropdown"
            @mouseenter="cancelClose"
            @mouseleave="scheduleClose()"
          >
            <NavbarMegaMenu :items="item.children" :compact="isCompactNav" @navigate="closeMobileMenu" />
          </div>
        </div>
      </nav>

      <label class="navbar__locale-dropdown">
        <select v-model="selectedLocale" class="navbar__locale-select" aria-label="Sayt tili">
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
      </label>
    </div>
  </header>
</template>
