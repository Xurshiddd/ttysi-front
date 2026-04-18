<script setup lang="ts">
import type { TtsModelMode } from '~/composables/useA11yPrefs'
import { ttsVoiceOptions } from '~/composables/useTts'

const { prefs, setTtsModel } = useA11yPrefs()

const activeVoices = computed(() => ttsVoiceOptions.filter((item) => item.enabled))

function isActive(value: string) {
  return prefs.value.ttsModel === value
}

function selectModel(value: TtsModelMode) {
  setTtsModel(value)
}
</script>

<template>
  <section class="navbar__a11y-row navbar__a11y-row--stack navbar__a11y-row--tts">
    <span class="navbar__a11y-label">TTS ovozi</span>

    <div class="navbar__a11y-control navbar__a11y-control--stack">
      <div class="navbar__tts-voices" aria-label="TTS modellar">
        <button
          v-for="voice in activeVoices"
          :key="voice.value"
          type="button"
          class="navbar__tts-voice-button"
          :class="{ 'is-active': isActive(voice.value) }"
          @click="selectModel(voice.value)"
        >
          {{ voice.label }}
        </button>
      </div>

      <p class="navbar__tts-note">
        UZ tilida tanlangan matn backend orqali hozirgi default ovoz bilan ijro qilinadi.
        RU va EN tillarida esa brauzerning o'z TTS ovozi ishlatiladi.
      </p>
    </div>
  </section>
</template>
