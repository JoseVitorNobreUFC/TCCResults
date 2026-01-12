// @ts-nocheck
async function evaluateDistributionItems(
  distribution: any,
  context: ExecutionContext,
  block: SerializedBlock
): Promise<any[] | Record<string, any> | null> {
  if (
    Array.isArray(distribution) ||
    (typeof distribution === 'object' && distribution !== null)
  ) {
    return distribution
  }
  if (typeof distribution === 'string') {
    try {
      const trimmed = distribution.trim()
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
        const resolved = this.resolver.resolveBlockReferences(distribution, context, block)
        try {
          return JSON.parse(resolved)
        } catch {
          try {
            const result = new Function(`return ${resolved}`)()
            if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {
              return result
            }
          } catch (e) {
            logger.error(`Error evaluating distribution expression: ${resolved}`, e)
          }
        }
      }
      logger.warn(`Distribution expression evaluation not fully implemented: ${distribution}`)
      return null
    } catch (error) {
      logger.error(`Error evaluating distribution items:`, error)
      return null
    }
  }
  return null
}