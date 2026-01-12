// @ts-nocheck
function updateBlockReferences(
  value: any,
  blockIdMapping: Map<string, string>,
  requestId: string
): any {
  if (typeof value === 'string' && value.includes('<') && value.includes('>')) {
    let processedValue = value
    const blockMatches = value.match(/<([^>]+)>/g)
    if (blockMatches) {
      for (const match of blockMatches) {
        const path = match.slice(1, -1)
        const [blockRef] = path.split('.')
        if (['start', 'loop', 'parallel', 'variable'].includes(blockRef.toLowerCase())) {
          continue
        }
        const newMappedId = blockIdMapping.get(blockRef)
        if (newMappedId) {
          logger.info(`[${requestId}] Updating block reference: ${blockRef} -> ${newMappedId}`)
          processedValue = processedValue.replace(
            new RegExp(`<${blockRef}\\.`, 'g'),
            `<${newMappedId}.`
          )
          processedValue = processedValue.replace(
            new RegExp(`<${blockRef}>`, 'g'),
            `<${newMappedId}>`
          )
        }
      }
    }
    return processedValue
  }
  if (Array.isArray(value)) {
    return value.map((item) => updateBlockReferences(item, blockIdMapping, requestId))
  }
  if (value !== null && typeof value === 'object') {
    const result = { ...value }
    for (const key in result) {
      result[key] = updateBlockReferences(result[key], blockIdMapping, requestId)
    }
    return result
  }
  return value
}