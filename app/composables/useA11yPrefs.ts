export type FontFamilyMode = 'default' | 'sans' | 'serif' | 'mono'
export type ThemeMode = 'ocean' | 'royal' | 'emerald' | 'sunset' | 'slate' | 'mono'
export type TtsModelMode = 'Iroda' | 'Surayyo_v2'

export interface A11yPrefs {
  contrastHigh: boolean
  reduceMotion: boolean
  fontScale: number
  fontFamily: FontFamilyMode
  theme: ThemeMode
  ttsModel: TtsModelMode
}

const STORAGE_KEY = 'ttysi:a11y'

const defaultPrefs: A11yPrefs = {
  contrastHigh: false,
  reduceMotion: false,
  fontScale: 1,
  fontFamily: 'default',
  theme: 'ocean',
  ttsModel: 'Iroda'
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function sanitizePrefs(raw: unknown): A11yPrefs {
  if (!raw || typeof raw !== 'object') return { ...defaultPrefs }
  const obj = raw as Record<string, unknown>

  const contrastHigh = Boolean(obj.contrastHigh)
  const reduceMotion = Boolean(obj.reduceMotion)

  const fontScaleRaw = typeof obj.fontScale === 'number' ? obj.fontScale : defaultPrefs.fontScale
  // Allow unbounded increase; keep a tiny floor to avoid 0px layouts.
  const fontScale = Math.max(0.1, Number.isFinite(fontScaleRaw) ? fontScaleRaw : defaultPrefs.fontScale)

  const fontFamilyRaw = typeof obj.fontFamily === 'string' ? obj.fontFamily : defaultPrefs.fontFamily
  const fontFamily: FontFamilyMode =
    fontFamilyRaw === 'sans' || fontFamilyRaw === 'serif' || fontFamilyRaw === 'mono' || fontFamilyRaw === 'default'
      ? fontFamilyRaw
      : 'default'

  const themeRaw = typeof obj.theme === 'string' ? obj.theme : defaultPrefs.theme
  const theme: ThemeMode =
    themeRaw === 'ocean' ||
    themeRaw === 'royal' ||
    themeRaw === 'emerald' ||
    themeRaw === 'sunset' ||
    themeRaw === 'slate' ||
    themeRaw === 'mono'
      ? themeRaw
      : 'ocean'

  const ttsModelRaw = typeof obj.ttsModel === 'string' ? obj.ttsModel : defaultPrefs.ttsModel
  const ttsModel: TtsModelMode =
    ttsModelRaw === 'Iroda' || ttsModelRaw === 'Surayyo_v2' ? ttsModelRaw : 'Iroda'

  return {
    contrastHigh,
    reduceMotion,
    fontScale,
    fontFamily,
    theme,
    ttsModel
  }
}

function applyToDocument(prefs: A11yPrefs) {
  if (!import.meta.client) return
  const root = document.documentElement
  root.dataset.contrast = prefs.contrastHigh ? 'high' : 'normal'
  root.dataset.reduceMotion = prefs.reduceMotion ? 'true' : 'false'
  root.dataset.font = prefs.fontFamily
  root.dataset.theme = prefs.theme
  root.style.setProperty('--font-scale', String(prefs.fontScale))
}

export function useA11yPrefs() {
  const prefs = useState<A11yPrefs>('a11y-prefs', () => ({ ...defaultPrefs }))

  if (import.meta.client) {
    // One-time hydrate from localStorage
    if (!(window as any).__ttysiA11yHydrated) {
      ;(window as any).__ttysiA11yHydrated = true
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) prefs.value = sanitizePrefs(JSON.parse(saved))
      } catch {
        // ignore
      }
      applyToDocument(prefs.value)
    }

    watch(
      prefs,
      (next) => {
        applyToDocument(next)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
      },
      { deep: true }
    )
  }

  const setContrastHigh = (value: boolean) => {
    prefs.value = { ...prefs.value, contrastHigh: value }
  }

  const toggleContrastHigh = () => setContrastHigh(!prefs.value.contrastHigh)

  const setReduceMotion = (value: boolean) => {
    prefs.value = { ...prefs.value, reduceMotion: value }
  }

  const toggleReduceMotion = () => setReduceMotion(!prefs.value.reduceMotion)

  const setFontFamily = (family: FontFamilyMode) => {
    prefs.value = { ...prefs.value, fontFamily: family }
  }

  const setTheme = (theme: ThemeMode) => {
    prefs.value = { ...prefs.value, theme }
  }

  const setFontScale = (scale: number) => {
    const rounded = Math.round(scale * 10) / 10
    prefs.value = { ...prefs.value, fontScale: Math.max(0.1, rounded) }
  }

  const setTtsModel = (ttsModel: TtsModelMode) => {
    prefs.value = { ...prefs.value, ttsModel }
  }

  const incFont = () => setFontScale(prefs.value.fontScale + 0.1)
  const decFont = () => setFontScale(prefs.value.fontScale - 0.1)
  const reset = () => {
    prefs.value = { ...defaultPrefs }
  }

  return {
    prefs,
    setContrastHigh,
    toggleContrastHigh,
    setReduceMotion,
    toggleReduceMotion,
    setFontFamily,
    setTheme,
    setFontScale,
    setTtsModel,
    incFont,
    decFont,
    reset
  }
}
