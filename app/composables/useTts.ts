import type { FrontendLocale } from './useNavbarData'

export type SupportedTtsModel = 'Iroda' | 'Surayyo_v2'
export type TtsModel = SupportedTtsModel
export type TtsOutputFormat = 'MP3' | 'WAV' | 'AAC' | 'OGG' | 'FLAC'

export interface TtsPlaybackResult {
  mode: 'remote-audio' | 'browser-fallback'
  audioUrl?: string
}

export interface VoiceOption {
  value: TtsModel
  label: string
  enabled: boolean
}

export interface SurayyoTtsData {
  [key: string]: string | number | boolean | null | SurayyoTtsData | Array<string | number | boolean | null | SurayyoTtsData>
}

interface ValidationErrorPayload {
  message?: string
  errors?: Record<string, string[]>
}

export const ttsVoiceOptions: VoiceOption[] = [
  { value: 'Iroda', label: 'Iroda', enabled: true },
  { value: 'Surayyo_v2', label: 'Surayyo V2', enabled: true }
]

function flattenValidationErrors(payload: ValidationErrorPayload) {
  const fieldErrors = Object.values(payload.errors ?? {})
    .flat()
    .filter(Boolean)

  if (fieldErrors.length) return fieldErrors.join(' ')
  return payload.message || "Ma'lumotni tekshirib qayta urinib ko'ring."
}

function isAudioContentType(contentType: string) {
  const normalized = contentType.toLowerCase()

  return normalized.startsWith('audio/') || normalized.includes('application/octet-stream')
}

function speechLang(locale: FrontendLocale) {
  if (locale === 'ru') return 'ru-RU'
  if (locale === 'en') return 'en-US'
  return 'uz-UZ'
}

export function useTts() {
  const config = useRuntimeConfig()
  const loader = useGlobalLoader()
  const selectedLocale = useState<FrontendLocale>('frontend-locale', () => 'uz')

  const loading = ref(false)
  const errorMessage = ref('')
  const audioUrl = ref<string | null>(null)
  const audioName = ref('ttysi-tts.mp3')
  let currentUtterance: SpeechSynthesisUtterance | null = null

  function revokeAudioUrl() {
    if (!audioUrl.value) return
    URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = null
  }

  function stopBrowserSpeech() {
    if (!import.meta.client || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    currentUtterance = null
  }

  function stopPlayback() {
    stopBrowserSpeech()
    revokeAudioUrl()
  }

  function resetAudioState() {
    stopPlayback()
    errorMessage.value = ''
  }

  function findMatchingVoice(locale: FrontendLocale) {
    if (!import.meta.client || !('speechSynthesis' in window)) return null

    const targetLang = speechLang(locale).toLowerCase()
    const voices = window.speechSynthesis.getVoices()

    return (
      voices.find((voice) => voice.lang.toLowerCase() === targetLang) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith(targetLang.split('-')[0])) ||
      null
    )
  }

  async function speakWithBrowser(text: string, locale: Exclude<FrontendLocale, 'uz'>): Promise<TtsPlaybackResult | null> {
    if (!import.meta.client || !('speechSynthesis' in window)) {
      errorMessage.value = "Brauzer TTS qo'llab-quvvatlanmaydi."
      return null
    }

    stopBrowserSpeech()

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = speechLang(locale)

      const voice = findMatchingVoice(locale)
      if (voice) utterance.voice = voice

      currentUtterance = utterance
      window.speechSynthesis.speak(utterance)

      return { mode: 'browser-fallback' }
    } catch {
      errorMessage.value = "Brauzer TTS ishga tushmadi."
      return null
    }
  }

  async function synthesize(
    text: string,
    model: SupportedTtsModel,
    options?: {
      format?: TtsOutputFormat
      data?: SurayyoTtsData
    }
  ): Promise<TtsPlaybackResult | null> {
    resetAudioState()
    const normalizedText = text.trim()

    if (!normalizedText) {
      errorMessage.value = 'Matn tanlanmadi.'
      return null
    }

    if (normalizedText.length > 5000) {
      errorMessage.value = "Tanlangan matn 5000 belgidan oshmasligi kerak."
      return null
    }

    if (selectedLocale.value !== 'uz') {
      return speakWithBrowser(normalizedText, selectedLocale.value)
    }

    const format = options?.format ?? 'MP3'

    loading.value = true
    loader.start()

    try {
      const response = await fetch(`${String(config.public.apiBase || '').replace(/\/$/, '')}/api/frontend/tts`, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: normalizedText,
          model,
          format,
          ...(model === 'Surayyo_v2' && options?.data ? { data: options.data } : {})
        })
      })

      const contentType = response.headers.get('content-type') || ''

      if (!response.ok) {
        let payload: ValidationErrorPayload | null = null

        if (contentType.includes('application/json')) {
          payload = await response.json()
        }

        if (response.status === 422) {
          errorMessage.value = flattenValidationErrors(payload ?? {})
          return null
        }

        if (response.status === 503) {
          errorMessage.value = payload?.message || "TTS service sozlanmagan. .env va API key'ni tekshiring."
          return null
        }

        if (response.status === 502) {
          errorMessage.value = payload?.message || "Audio generatsiya bo'lmadi."
          return null
        }

        errorMessage.value = payload?.message || "Ovozga o'girishda xatolik yuz berdi."
        return null
      }

      if (!isAudioContentType(contentType)) {
        let payload: ValidationErrorPayload | null = null

        if (contentType.includes('application/json')) {
          payload = await response.json()
        }

        if (response.status === 202) {
          errorMessage.value = payload?.message || "Audio hali tayyor emas. Birozdan so'ng qayta urinib ko'ring."
          return null
        }

        errorMessage.value = payload?.message || "Audio javobi kutilgan formatda kelmadi."
        return null
      }

      const blob = await response.blob()

      if (!blob.size) {
        errorMessage.value = "Audio generatsiya bo'lmadi."
        return null
      }

      audioUrl.value = URL.createObjectURL(blob)
      audioName.value = `ttysi-${model}-${Date.now()}.${format.toLowerCase()}`

      return {
        mode: 'remote-audio',
        audioUrl: audioUrl.value
      }
    } catch {
      errorMessage.value = "Server bilan bog'lanishda muammo bo'ldi."
      return null
    } finally {
      loading.value = false
      loader.finish()
    }
  }

  onBeforeUnmount(() => {
    stopPlayback()
  })

  return {
    loading,
    errorMessage,
    audioUrl,
    audioName,
    resetAudioState,
    revokeAudioUrl,
    stopPlayback,
    synthesize
  }
}
