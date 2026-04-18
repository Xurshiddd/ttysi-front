import type { MenuItem } from '~/composables/useNavbarData'

function normalizeMenuText(value?: string | null) {
  return (value ?? '')
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function menuLabel(item: Pick<MenuItem, 'title' | 'name'>) {
  return item.name || item.title || 'Menu'
}

export function sortMenuItems(items?: MenuItem[] | null) {
  return [...(items ?? [])]
    .filter((item) => item.status)
    .sort((left, right) => left.order - right.order)
}

export function resolveMenuPagePath(item: Pick<MenuItem, 'id' | 'title' | 'name'>) {
  const slug = normalizeMenuText(menuLabel(item))
  return slug ? `/menu/${item.id}-${slug}` : `/menu/${item.id}`
}

export function extractMenuIdFromParam(value: string | string[] | undefined) {
  const source = Array.isArray(value) ? value[0] : value
  const rawId = source?.split('-')[0] ?? ''
  const parsed = Number.parseInt(rawId, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function findMenuTrail(items: MenuItem[] | undefined, targetId: number | null): MenuItem[] {
  if (targetId == null) return []

  for (const item of items ?? []) {
    if (item.id === targetId) return [item]

    const childTrail = findMenuTrail(item.children, targetId)
    if (childTrail.length) return [item, ...childTrail]
  }

  return []
}
