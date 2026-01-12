// @ts-nocheck
function formatValueForCodeContext(
  value: any,
  block: SerializedBlock,
  isInTemplateLiteral = false
): string {
  if (block.metadata?.id === 'function') {
    if (isInTemplateLiteral) {
      if (typeof value === 'string') {
        return value
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value)
      }
      return String(value)
    }
    if (typeof value === 'string') {
      return JSON.stringify(value)
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    if (value === undefined) {
      return 'undefined'
    }
    if (value === null) {
      return 'null'
    }
    return String(value)
  }
  return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
}