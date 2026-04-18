<script setup lang="ts">
import type { TtsModelMode } from '~/composables/useA11yPrefs'
import { ttsVoiceOptions } from '~/composables/useTts'

const { prefs } = useA11yPrefs()
const selectedLocale = useState('frontend-locale', () => 'uz')
const { loading, errorMessage, audioUrl, synthesize, resetAudioState, stopPlayback } = useTts()

const selectedText = ref('')
const triggerVisible = ref(false)
const triggerTop = ref(0)
const triggerLeft = ref(0)
const feedbackVisible = ref(false)
const playbackMessage = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
let activeAudio: HTMLAudioElement | null = null

function clearFeedbackTimer() {
  if (!feedbackTimer) return
  clearTimeout(feedbackTimer)
  feedbackTimer = null
}

function hideTrigger() {
  triggerVisible.value = false
  selectedText.value = ''
}

function stopActiveAudio() {
  if (!activeAudio) return
  activeAudio.pause()
  activeAudio.currentTime = 0
  activeAudio.src = ''
  activeAudio.load()
  activeAudio = null
}

function showFeedback() {
  feedbackVisible.value = true
  clearFeedbackTimer()
  feedbackTimer = setTimeout(() => {
    feedbackVisible.value = false
  }, 3200)
}

function selectionInsideIgnoredRoot(node: Node | null) {
  if (!node) return false
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement
  if (!element) return false

  return Boolean(element.closest('.navbar__a11y, .navbar__a11y-panel, .navbar__tts-trigger'))
}

function updateSelectionTrigger() {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    hideTrigger()
    return
  }

  const text = selection.toString().replace(/\s+/g, ' ').trim()
  const anchorNode = selection.anchorNode

  if (!text || selectionInsideIgnoredRoot(anchorNode)) {
    hideTrigger()
    return
  }

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  if ((!rect.width && !rect.height) || rect.bottom < 0 || rect.top > window.innerHeight) {
    hideTrigger()
    return
  }

  selectedText.value = text
  triggerVisible.value = true
  triggerTop.value = Math.min(window.innerHeight - 56, Math.max(10, rect.bottom + 10))
  triggerLeft.value = Math.min(window.innerWidth - 52, Math.max(10, rect.right - 18))
}

async function playSelection() {
  const text = selectedText.value.trim()
  if (!text || loading.value) return

  feedbackVisible.value = false
  playbackMessage.value = ''
  stopActiveAudio()
  stopPlayback()

  const result = await synthesize(text, prefs.value.ttsModel as TtsModelMode)

  if (!result) {
    showFeedback()
    return
  }

  if (result.mode === 'browser-fallback') {
    playbackMessage.value =
      selectedLocale.value === 'ru'
        ? 'Brauzer ovozi bilan rus tilida ijro etilmoqda.'
        : 'Brauzer ovozi bilan ingliz tilida ijro etilmoqda.'
    showFeedback()
    return
  }

  try {
    const audio = new Audio(result.audioUrl)
    audio.preload = 'auto'
    activeAudio = audio
    await audio.play()
    playbackMessage.value = `Ijro etilmoqda: ${ttsVoiceOptions.find((item) => item.value === prefs.value.ttsModel)?.label || prefs.value.ttsModel}`
  } catch {
    playbackMessage.value = "Audio tayyor bo'ldi, lekin brauzer uni avtomatik ijro qila olmadi."
  }

  showFeedback()
}

function onPointerUp() {
  requestAnimationFrame(() => {
    updateSelectionTrigger()
  })
}

function onKeyUp() {
  requestAnimationFrame(() => {
    updateSelectionTrigger()
  })
}

function onSelectionChange() {
  requestAnimationFrame(() => {
    updateSelectionTrigger()
  })
}

function onScroll() {
  if (!triggerVisible.value) return
  updateSelectionTrigger()
}

onMounted(() => {
  document.addEventListener('selectionchange', onSelectionChange)
  document.addEventListener('mouseup', onPointerUp)
  document.addEventListener('keyup', onKeyUp)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
  document.removeEventListener('mouseup', onPointerUp)
  document.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  clearFeedbackTimer()
  stopActiveAudio()
  stopPlayback()
  resetAudioState()
})

watch(audioUrl, () => {
  if (audioUrl.value) return
  playbackMessage.value = ''
  feedbackVisible.value = false
})

const triggerStyle = computed(() => ({
  top: `${triggerTop.value}px`,
  left: `${triggerLeft.value}px`
}))

const feedbackText = computed(() => {
  if (loading.value) return "Ovoz tayyorlanmoqda..."
  if (errorMessage.value) return errorMessage.value
  if (playbackMessage.value) return playbackMessage.value
  return ''
})
</script>

<template>
  <div v-if="triggerVisible" class="navbar__tts-trigger" :style="triggerStyle">
    <button
      type="button"
      class="navbar__tts-trigger-button"
      :disabled="loading"
      :aria-label="`Tanlangan matnni ${prefs.ttsModel} ovozida eshittirish`"
      @mousedown.prevent
      @click="playSelection"
    >
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M5 9v6h4l5 4V5L9 9H5Z" fill="currentColor" />
          <path d="M17 8.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M19.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>
    </button>

    <Transition name="a11y-slide">
      <div v-if="feedbackVisible && feedbackText" class="navbar__tts-feedback">
        {{ feedbackText }}
      </div>
    </Transition>
  </div>
</template>
