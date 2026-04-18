export function useGlobalLoader() {
  const pendingCount = useState<number>('global-loader-pending', () => 0)
  const booting = useState<boolean>('global-loader-booting', () => true)
  const bootStartedAt = useState<number>('global-loader-boot-started', () => Date.now())

  function start() {
    pendingCount.value += 1
  }

  function finish() {
    pendingCount.value = Math.max(0, pendingCount.value - 1)
  }

  async function finishBoot(minDuration = 600) {
    const elapsed = Date.now() - bootStartedAt.value
    const remaining = Math.max(0, minDuration - elapsed)

    if (remaining) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, remaining)
      })
    }

    booting.value = false
  }

  return {
    pendingCount,
    booting,
    isVisible: computed(() => booting.value || pendingCount.value > 0),
    start,
    finish,
    finishBoot
  }
}
