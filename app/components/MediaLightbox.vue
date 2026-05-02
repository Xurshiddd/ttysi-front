<script setup lang="ts">
export interface MediaLightboxItem {
  id: string | number
  type: 'image' | 'video' | 'iframe'
  url: string
  title?: string | null
  description?: string | null
  poster?: string | null
  mimeType?: string | null
}

const props = defineProps<{
  items: MediaLightboxItem[]
}>()

defineSlots<{
  default(props: { open: (index?: number) => void }): unknown
}>()

const isOpen = ref(false)
const activeIndex = ref(0)
const zoom = ref(1)

const activeItem = computed(() => props.items[activeIndex.value] ?? null)
const canGoPrevious = computed(() => props.items.length > 1)
const canGoNext = computed(() => props.items.length > 1)
const canZoom = computed(() => activeItem.value?.type === 'image')

function resetZoom() {
  zoom.value = 1
}

function open(index = 0) {
  if (!props.items.length) return

  activeIndex.value = Math.min(Math.max(index, 0), props.items.length - 1)
  resetZoom()
  isOpen.value = true
}

function close() {
  isOpen.value = false
  resetZoom()
}

function previous() {
  if (!props.items.length) return

  activeIndex.value = activeIndex.value === 0 ? props.items.length - 1 : activeIndex.value - 1
  resetZoom()
}

function next() {
  if (!props.items.length) return

  activeIndex.value = activeIndex.value === props.items.length - 1 ? 0 : activeIndex.value + 1
  resetZoom()
}

function zoomIn() {
  if (!canZoom.value) return
  zoom.value = Math.min(3, Number((zoom.value + 0.25).toFixed(2)))
}

function zoomOut() {
  if (!canZoom.value) return
  zoom.value = Math.max(1, Number((zoom.value - 0.25).toFixed(2)))
}

function onWheel(event: WheelEvent) {
  if (!canZoom.value) return

  event.preventDefault()
  if (event.deltaY < 0) zoomIn()
  else zoomOut()
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  if (event.key === 'Escape') close()
  if (event.key === 'ArrowLeft') previous()
  if (event.key === 'ArrowRight') next()
  if (event.key === '+' || event.key === '=') zoomIn()
  if (event.key === '-') zoomOut()
  if (event.key === '0') resetZoom()
}

watch(isOpen, (value) => {
  if (!import.meta.client) return

  document.body.style.overflow = value ? 'hidden' : ''
})

watch(activeItem, () => {
  resetZoom()
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <slot :open="open" />

  <Teleport to="body">
    <transition name="media-lightbox">
      <div v-if="isOpen && activeItem" class="media-lightbox" @click.self="close">
        <div class="media-lightbox__panel" role="dialog" aria-modal="true" :aria-label="activeItem.title || 'Media viewer'">
          <div class="media-lightbox__toolbar">
            <div class="media-lightbox__counter">
              {{ activeIndex + 1 }} / {{ items.length }}
            </div>

            <div class="media-lightbox__actions">
              <button v-if="canZoom" type="button" class="media-lightbox__button" aria-label="Zoom out" @click="zoomOut">
                -
              </button>
              <button v-if="canZoom" type="button" class="media-lightbox__button" aria-label="Reset zoom" @click="resetZoom">
                {{ Math.round(zoom * 100) }}%
              </button>
              <button v-if="canZoom" type="button" class="media-lightbox__button" aria-label="Zoom in" @click="zoomIn">
                +
              </button>
              <button type="button" class="media-lightbox__button" aria-label="Close" @click="close">
                x
              </button>
            </div>
          </div>

          <button
            v-if="canGoPrevious"
            type="button"
            class="media-lightbox__nav media-lightbox__nav--prev"
            aria-label="Previous media"
            @click="previous"
          >
            <
          </button>

          <div class="media-lightbox__stage" @wheel="onWheel">
            <img
              v-if="activeItem.type === 'image'"
              :src="activeItem.url"
              :alt="activeItem.title || ''"
              class="media-lightbox__asset media-lightbox__asset--image"
              :style="{ transform: `scale(${zoom})` }"
            >

            <video
              v-else-if="activeItem.type === 'video'"
              class="media-lightbox__asset media-lightbox__asset--video"
              :poster="activeItem.poster || undefined"
              controls
              autoplay
              playsinline
            >
              <source :src="activeItem.url" :type="activeItem.mimeType || 'video/mp4'">
            </video>

            <iframe
              v-else
              class="media-lightbox__asset media-lightbox__asset--iframe"
              :src="activeItem.url"
              :title="activeItem.title || 'Media'"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            />
          </div>

          <button
            v-if="canGoNext"
            type="button"
            class="media-lightbox__nav media-lightbox__nav--next"
            aria-label="Next media"
            @click="next"
          >
            >
          </button>

          <div v-if="activeItem.title || activeItem.description" class="media-lightbox__caption">
            <h3 v-if="activeItem.title">{{ activeItem.title }}</h3>
            <p v-if="activeItem.description">{{ activeItem.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.media-lightbox {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(4, 15, 28, 0.86);
}

.media-lightbox__panel {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(1160px, 100%);
  height: min(760px, calc(100vh - 36px));
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  background: #061827;
  color: #f8fbff;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.38);
}

.media-lightbox__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.media-lightbox__counter {
  font-size: 0.9rem;
  font-weight: 800;
}

.media-lightbox__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.media-lightbox__button,
.media-lightbox__nav {
  display: inline-grid;
  place-items: center;
  border: 0;
  background: rgba(255, 255, 255, 0.12);
  color: inherit;
  cursor: pointer;
}

.media-lightbox__button {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border-radius: 10px;
  font-weight: 900;
}

.media-lightbox__button:hover,
.media-lightbox__button:focus-visible,
.media-lightbox__nav:hover,
.media-lightbox__nav:focus-visible {
  background: rgba(255, 255, 255, 0.2);
}

.media-lightbox__stage {
  display: grid;
  place-items: center;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.media-lightbox__asset {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.media-lightbox__asset--image {
  transform-origin: center;
  transition: transform 140ms ease;
}

.media-lightbox__asset--video,
.media-lightbox__asset--iframe {
  width: 100%;
  height: 100%;
}

.media-lightbox__asset--video {
  object-fit: contain;
}

.media-lightbox__asset--iframe {
  border: 0;
}

.media-lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  width: 44px;
  height: 56px;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: 900;
  transform: translateY(-50%);
}

.media-lightbox__nav--prev {
  left: 12px;
}

.media-lightbox__nav--next {
  right: 12px;
}

.media-lightbox__caption {
  display: grid;
  gap: 6px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.06);
}

.media-lightbox__caption h3,
.media-lightbox__caption p {
  margin: 0;
}

.media-lightbox__caption h3 {
  font-size: 1rem;
}

.media-lightbox__caption p {
  color: rgba(248, 251, 255, 0.78);
  font-size: 0.92rem;
}

.media-lightbox-enter-active,
.media-lightbox-leave-active {
  transition: opacity 160ms ease;
}

.media-lightbox-enter-from,
.media-lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .media-lightbox {
    padding: 10px;
  }

  .media-lightbox__panel {
    height: calc(100vh - 20px);
    border-radius: 14px;
  }

  .media-lightbox__toolbar {
    align-items: flex-start;
  }

  .media-lightbox__actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .media-lightbox__nav {
    top: auto;
    bottom: 74px;
    transform: none;
  }
}
</style>
