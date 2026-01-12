// @ts-nocheck
function validateVariable(variable: Variable): string | undefined {
  try {
    switch (variable.type) {
      case 'number':
        if (Number.isNaN(Number(variable.value))) {
          return 'Not a valid number'
        }
        break
      case 'boolean':
        if (!/^(true|false)$/i.test(String(variable.value).trim())) {
          return 'Expected `true` or `false`'
        }
        break
      case 'object':
        try {
          const valueToEvaluate = String(variable.value).trim()
          if (!valueToEvaluate.startsWith('{') || !valueToEvaluate.endsWith('}')) {
            return 'Not a valid object format'
          }
          const parsed = new Function(`return ${valueToEvaluate}`)()
          if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return 'Not a valid object'
          }
          return undefined
        } catch (e) {
          logger.error('Object parsing error:', e)
          return 'Invalid object syntax'
        }
      case 'array':
        try {
          const parsed = JSON.parse(String(variable.value))
          if (!Array.isArray(parsed)) {
            return 'Not a valid JSON array'
          }
        } catch {
          return 'Invalid JSON array syntax'
        }
        break
    }
    return undefined
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid format'
  }
}