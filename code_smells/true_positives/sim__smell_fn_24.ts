// @ts-nocheck
function getParallelItems(
  parallel: any,
  context: ExecutionContext
): any[] | Record<string, any> | null {
  if (!parallel || !parallel.distribution) return null
  if (
    Array.isArray(parallel.distribution) ||
    (typeof parallel.distribution === 'object' && parallel.distribution !== null)
  ) {
    return parallel.distribution
  }
  if (typeof parallel.distribution === 'string') {
    try {
      const trimmedExpression = parallel.distribution.trim()
      if (trimmedExpression.startsWith('[') || trimmedExpression.startsWith('{')) {
        try {
          return JSON.parse(trimmedExpression)
        } catch {
        }
      }
      if (trimmedExpression && !trimmedExpression.startsWith('//')) {
        const result = new Function('context', `return ${parallel.distribution}`)(context)
        if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {
          return result
        }
      }
    } catch (e) {
      console.error('Error evaluating parallel distribution items:', e)
    }
  }
  return []
}