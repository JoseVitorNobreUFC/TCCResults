// @ts-nocheck
function safeSerialize(obj: any): any {
  if (obj === null || obj === undefined) return null
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    return obj.map((item) => safeSerialize(item))
  }
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (key in obj) {
      const value = obj[key]
      if (
        value === undefined ||
        value === null ||
        typeof value === 'function' ||
        typeof value === 'symbol'
      ) {
        continue
      }
      try {
        result[key] = safeSerialize(value)
      } catch (_e) {
        try {
          result[key] = String(value)
        } catch (_e2) { }
      }
    }
  }
  return result
}