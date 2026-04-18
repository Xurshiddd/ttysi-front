function prefersReducedMotion() {
  if (!import.meta.client) return true

  if (document.documentElement.dataset.reduceMotion === 'true') return true

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useLandingMotion() {
  function registerReveals(root?: ParentNode | null) {
    if (!import.meta.client) return () => {}

    const scope = root ?? document
    const elements = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (!elements.length) return () => {}

    if (prefersReducedMotion()) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return () => {}
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }

  return {
    prefersReducedMotion,
    registerReveals
  }
}
