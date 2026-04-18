<script setup lang="ts">
import type { MenuItem } from '~/composables/useNavbarData'

defineOptions({ name: 'NavbarMegaMenu' })

const props = defineProps<{
  items: MenuItem[]
  compact?: boolean
}>()
const emit = defineEmits<{
  navigate: []
}>()

const sortedRoot = computed(() =>
  [...(props.items ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
)

const activeIds = ref<number[]>([])
const compactOpenIds = ref<number[]>([])

function sortedChildren(item: MenuItem | undefined) {
  return [...(item?.children ?? [])]
    .filter((child) => child.status)
    .sort((left, right) => left.order - right.order)
}

function resolveHref(item: MenuItem) {
  return item.link || resolveMenuPagePath(item)
}

function ariaLabel(item: MenuItem) {
  const base = menuLabel(item)
  return item.description ? `${base}. ${item.description}` : base
}

function setActive(level: number, item: MenuItem) {
  const next = activeIds.value.slice(0, level)
  next[level] = item.id
  activeIds.value = next
}

function clearActive() {
  activeIds.value = []
}

function isCompactOpen(itemId: number) {
  return compactOpenIds.value.includes(itemId)
}

function toggleCompact(item: MenuItem) {
  if (!item.children.length) return

  compactOpenIds.value = isCompactOpen(item.id)
    ? compactOpenIds.value.filter((id) => id !== item.id)
    : [...compactOpenIds.value, item.id]
}

function onNavigate() {
  emit('navigate')
}

const columns = computed(() => {
  const result: MenuItem[][] = []
  let current = sortedRoot.value

  for (let level = 0; current.length; level++) {
    if (!current.length) break
    result.push(current)

    const activeId = activeIds.value[level]
    if (activeId == null) break

    const active = current.find((item) => item.id === activeId)
    if (!active) break

    current = sortedChildren(active)
  }

  return result
})
</script>

<template>
  <div v-if="compact" class="navbar__mega navbar__mega--compact" role="menu">
    <section class="navbar__mega-col navbar__mega-col--compact" aria-label="Mobil menu darajasi">
      <div
        v-for="item in sortedRoot"
        :key="item.id"
        class="navbar__mega-item navbar__mega-item--compact"
        :class="{ 'is-active': isCompactOpen(item.id) }"
      >
        <div class="navbar__mega-compact-row">
          <a
            v-if="item.is_link && item.link"
            :href="resolveHref(item)"
            class="navbar__mega-link"
            :aria-label="ariaLabel(item)"
            target="_blank"
            rel="noreferrer"
            @click="onNavigate"
          >
            {{ menuLabel(item) }}
          </a>

          <NuxtLink
            v-else-if="item.is_link"
            :to="resolveHref(item)"
            class="navbar__mega-link"
            :aria-label="ariaLabel(item)"
            @click="onNavigate"
          >
            {{ menuLabel(item) }}
          </NuxtLink>

          <button
            v-else
            type="button"
            class="navbar__mega-link navbar__mega-link--button"
            :aria-label="ariaLabel(item)"
            @click="toggleCompact(item)"
          >
            {{ menuLabel(item) }}
          </button>

          <button
            v-if="item.children.length"
            type="button"
            class="navbar__mega-expander"
            :aria-expanded="String(isCompactOpen(item.id))"
            :aria-label="`${menuLabel(item)} ichki bo'limlarini ochish`"
            @click.stop="toggleCompact(item)"
          >
            <span class="navbar__mega-arrow" aria-hidden="true">{{ isCompactOpen(item.id) ? '−' : '+' }}</span>
          </button>
        </div>

        <div v-if="item.children.length && isCompactOpen(item.id)" class="navbar__mega-compact-children">
          <NavbarMegaMenu
            :items="item.children"
            :compact="compact"
            @navigate="onNavigate"
          />
        </div>
      </div>
    </section>
  </div>

  <div v-else class="navbar__mega" role="menu" @mouseleave="clearActive">
    <section
      v-for="(col, level) in columns"
      :key="level"
      class="navbar__mega-col"
      :aria-label="`Menu darajasi ${level + 1}`"
    >
      <div
        v-for="item in col"
        :key="item.id"
        class="navbar__mega-item"
        :class="{
          'is-active': activeIds[level] === item.id,
          'has-children': item.children.length
        }"
        @mouseenter="setActive(level, item)"
      >
        <a
          v-if="item.is_link && item.link"
          :href="resolveHref(item)"
            class="navbar__mega-link"
            :aria-label="ariaLabel(item)"
            @mouseenter="setActive(level, item)"
            @focus="setActive(level, item)"
            target="_blank"
            rel="noreferrer"
            @click="onNavigate"
          >
            {{ menuLabel(item) }}
            <span v-if="item.children.length" class="navbar__mega-arrow" aria-hidden="true">›</span>
          </a>

        <NuxtLink
          v-else-if="item.is_link"
          :to="resolveHref(item)"
            class="navbar__mega-link"
            :aria-label="ariaLabel(item)"
            @mouseenter="setActive(level, item)"
            @focus="setActive(level, item)"
            @click="onNavigate"
          >
            {{ menuLabel(item) }}
            <span v-if="item.children.length" class="navbar__mega-arrow" aria-hidden="true">›</span>
          </NuxtLink>

        <button
          v-else
          type="button"
          class="navbar__mega-link navbar__mega-link--button"
          :aria-label="ariaLabel(item)"
          @mouseenter="setActive(level, item)"
          @focus="setActive(level, item)"
        >
          {{ menuLabel(item) }}
          <span v-if="item.children.length" class="navbar__mega-arrow" aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  </div>
</template>
