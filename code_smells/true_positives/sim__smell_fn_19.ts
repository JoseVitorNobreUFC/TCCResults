// @ts-nocheck
const visibleSubBlocks = subBlocks.filter((block) => {
  if (block.hidden) return false
  if (block.mode) {
    if (block.mode === 'basic' && isAdvancedMode) return false
    if (block.mode === 'advanced' && !isAdvancedMode) return false
  }
  if (!block.condition) return true
  const fieldValue = stateToUse[block.condition.field]?.value
  const andFieldValue = block.condition.and
    ? stateToUse[block.condition.and.field]?.value
    : undefined
  const isValueMatch = Array.isArray(block.condition.value)
    ? fieldValue != null &&
    (block.condition.not
      ? !block.condition.value.includes(fieldValue as string | number | boolean)
      : block.condition.value.includes(fieldValue as string | number | boolean))
    : block.condition.not
      ? fieldValue !== block.condition.value
      : fieldValue === block.condition.value
  const isAndValueMatch =
    !block.condition.and ||
    (Array.isArray(block.condition.and.value)
      ? andFieldValue != null &&
      (block.condition.and.not
        ? !block.condition.and.value.includes(andFieldValue as string | number | boolean)
        : block.condition.and.value.includes(andFieldValue as string | number | boolean))
      : block.condition.and.not
        ? andFieldValue !== block.condition.and.value
        : andFieldValue === block.condition.and.value)
  return isValueMatch && isAndValueMatch
})