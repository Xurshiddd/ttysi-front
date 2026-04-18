<script setup lang="ts">
import type { FontFamilyMode, ThemeMode } from '~/composables/useA11yPrefs'

const { prefs, toggleContrastHigh, toggleReduceMotion, incFont, decFont, setFontFamily, setTheme, reset } =
  useA11yPrefs()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function onDocPointerDown(e: PointerEvent) {
  const target = e.target as Node | null
  if (!target) return
  if (rootEl.value && rootEl.value.contains(target)) return
  close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onDocPointerDown)
})

const fontLabel = computed(() => {
  const map: Record<FontFamilyMode, string> = {
    default: 'Default',
    sans: 'Sans',
    serif: 'Serif',
    mono: 'Mono'
  }
  return map[prefs.value.fontFamily]
})

const themeLabel = computed(() => {
  const map: Record<ThemeMode, string> = {
    ocean: "Ko'k (Ocean)",
    royal: 'Royal',
    emerald: 'Emerald',
    sunset: 'Sunset',
    slate: 'Slate',
    mono: 'Mono'
  }
  return map[prefs.value.theme]
})

const ttsLabel = computed(() => (prefs.value.ttsModel === 'Iroda' ? 'Iroda' : 'Surayyo V2'))
</script>

<template>
  <div ref="rootEl" class="navbar__a11y">
    <button
      type="button"
      class="navbar__a11y-button"
      :class="{ 'is-open': open }"
      aria-label="Sayt sozlamalari"
      aria-haspopup="dialog"
      :aria-expanded="String(open)"
      @click="toggle"
    >
      <span class="navbar__a11y-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19.4 13.3a7.8 7.8 0 0 0 0-2.6l2-1.5-2-3.4-2.4 1a8.2 8.2 0 0 0-2.2-1.3l-.4-2.6H9.6l-.4 2.6a8.2 8.2 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0 0 2.6l-2 1.5 2 3.4 2.4-1c.7.6 1.4 1 2.2 1.3l.4 2.6h4.8l.4-2.6c.8-.3 1.5-.7 2.2-1.3l2.4 1 2-3.4-2-1.5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    <Transition name="a11y-slide">
        <div v-if="open" class="navbar__a11y-panel" role="dialog" aria-label="Sayt sozlamalari">
        <div class="navbar__a11y-row">
          <span class="navbar__a11y-label">Kontrast</span>
          <div class="navbar__a11y-control">
            <button type="button" class="navbar__a11y-toggle" @click="toggleContrastHigh">
              {{ prefs.contrastHigh ? "Yuqori" : "Oddiy" }}
            </button>
          </div>
        </div>

        <div class="navbar__a11y-row">
          <span class="navbar__a11y-label">Shrift kattaligi</span>
          <div class="navbar__a11y-control">
            <div class="navbar__a11y-stepper" role="group" aria-label="Shrift kattaligi">
              <button type="button" class="navbar__a11y-step" aria-label="Kichraytirish" @click="decFont">A-</button>
              <span class="navbar__a11y-value">{{ Math.round(prefs.fontScale * 100) }}%</span>
              <button type="button" class="navbar__a11y-step" aria-label="Kattalashtirish" @click="incFont">A+</button>
            </div>
          </div>
        </div>

        <div class="navbar__a11y-row">
          <span class="navbar__a11y-label">Shrift turi</span>
          <div class="navbar__a11y-control">
            <div class="navbar__a11y-select" role="group" aria-label="Shrift turi">
              <button
                type="button"
                class="navbar__a11y-toggle"
                :class="{ 'is-active': prefs.fontFamily === 'default' }"
                @click="setFontFamily('default')"
              >
                Default
              </button>
              <button
                type="button"
                class="navbar__a11y-toggle"
                :class="{ 'is-active': prefs.fontFamily === 'sans' }"
                @click="setFontFamily('sans')"
              >
                Sans
              </button>
              <button
                type="button"
                class="navbar__a11y-toggle"
                :class="{ 'is-active': prefs.fontFamily === 'serif' }"
                @click="setFontFamily('serif')"
              >
                Serif
              </button>
              <button
                type="button"
                class="navbar__a11y-toggle"
                :class="{ 'is-active': prefs.fontFamily === 'mono' }"
                @click="setFontFamily('mono')"
              >
                Mono
              </button>
            </div>
          </div>
        </div>

        <div class="navbar__a11y-row navbar__a11y-row--stack">
          <span class="navbar__a11y-label">Rang mavzusi</span>
          <div class="navbar__a11y-control navbar__a11y-control--stack">
            <div class="navbar__a11y-themes" role="group" aria-label="Rang mavzusi">
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'ocean' }"
                data-theme="ocean"
                @click="setTheme('ocean')"
              >
                Ocean
              </button>
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'royal' }"
                data-theme="royal"
                @click="setTheme('royal')"
              >
                Royal
              </button>
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'emerald' }"
                data-theme="emerald"
                @click="setTheme('emerald')"
              >
                Emerald
              </button>
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'sunset' }"
                data-theme="sunset"
                @click="setTheme('sunset')"
              >
                Sunset
              </button>
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'slate' }"
                data-theme="slate"
                @click="setTheme('slate')"
              >
                Slate
              </button>
              <button
                type="button"
                class="navbar__a11y-theme"
                :class="{ 'is-active': prefs.theme === 'mono' }"
                data-theme="mono"
                @click="setTheme('mono')"
              >
                Mono
              </button>
            </div>
          </div>
        </div>

        <div class="navbar__a11y-row">
          <span class="navbar__a11y-label">Animatsiya</span>
          <div class="navbar__a11y-control">
            <button type="button" class="navbar__a11y-toggle" @click="toggleReduceMotion">
              {{ prefs.reduceMotion ? "Kam" : "Odatiy" }}
            </button>
          </div>
        </div>

        <AppTtsPanel />

        <div class="navbar__a11y-footer">
          <span class="navbar__a11y-hint">Hozir: {{ themeLabel }}, {{ fontLabel }}, {{ ttsLabel }}</span>
          <button type="button" class="navbar__a11y-reset" @click="reset">Reset</button>
        </div>
      </div>
    </Transition>
  </div>
</template>
