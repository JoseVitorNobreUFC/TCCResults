// @ts-nocheck
() => {
  const visibility = resolvedClickMap.get(el)?.visibilityState.value ?? 'shown'
  if (!clicksContext?.value || !['slide', 'presenter'].includes(renderContext?.value ?? '')) {
    const mixedVariant: Record<string, unknown> = { ...variantInitial, ...variantEnter }
    for (const { variant } of clicks)
      Object.assign(mixedVariant, variant)
    motion.set(mixedVariant)
  }
  else if (isPrintMode.value || thisPage?.value === currentPage.value) {
    if (visibility === 'shown') {
      const mixedVariant: Record<string, unknown> = { ...variantInitial, ...variantEnter }
      for (const { variant, info } of clicks) {
        if (!info || info.isActive.value)
          Object.assign(mixedVariant, variant)
      }
      if (isPrintMode.value)
        motion.set(mixedVariant)
      else
        motion.apply(mixedVariant)
    }
    else {
      motion.apply(visibility === 'before' ? variantInitial : variantLeave)
    }
  }
  else {
    motion.apply((thisPage?.value ?? -1) > currentPage.value ? variantInitial : variantLeave)
  }
}