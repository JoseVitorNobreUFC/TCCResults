// @ts-nocheck
async function evaluateForEachItems(
  forEachItems: any,
  context: ExecutionContext,
  block: SerializedBlock
): Promise<any[] | Record<string, any> | null> {
  if (
    Array.isArray(forEachItems) ||
    (typeof forEachItems === 'object' && forEachItems !== null)
  ) {
    return forEachItems
  }
  if (typeof forEachItems === 'string') {
    try {
      const trimmed = forEachItems.trim()
      if (trimmed.startsWith('//') || trimmed === '') {
        return []
      }
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          return JSON.parse(trimmed)
        } catch {
        }
      }
      if (this.resolver) {
        const resolved = this.resolver.resolveBlockReferences(forEachItems, context, block)
        try {
          return JSON.parse(resolved)
        } catch {
          try {
            const result = new Function(`return ${resolved}`)()
            if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {
              return result
            }
          } catch (e) {
            logger.error(`Error evaluating forEach expression: ${resolved}`, e)
          }
        }
      }
      logger.warn(`forEach expression evaluation not fully implemented: ${forEachItems}`)
      return null
    } catch (error) {
      logger.error(`Error evaluating forEach items:`, error)
      return null
    }
  }
  return null
}