// @ts-nocheck
const getValidationStatus = (variable: Variable): string | undefined => {
  if (variable.value === '') return undefined
  switch (variable.type) {
    case 'number':
      return Number.isNaN(Number(variable.value)) ? 'Not a valid number' : undefined
    case 'boolean':
      return !/^(true|false)$/i.test(String(variable.value).trim())
        ? 'Expected `true` or `false`'
        : undefined
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
        logger.info('Object parsing error:', e)
        return 'Invalid object syntax'
      }
    case 'array':
      try {
        const valueToEvaluate = String(variable.value).trim()
        if (!valueToEvaluate.startsWith('[') || !valueToEvaluate.endsWith(']')) {
          return 'Not a valid array format'
        }
        const parsed = new Function(`return ${valueToEvaluate}`)()
        if (!Array.isArray(parsed)) {
          return 'Not a valid array'
        }
        return undefined
      } catch (e) {
        logger.info('Array parsing error:', e)
        return 'Invalid array syntax'
      }
    default:
      return undefined
  }
}