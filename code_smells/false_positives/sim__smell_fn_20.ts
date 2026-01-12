// @ts-nocheck
transformError: (error) => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null) {
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error
      }
      if (typeof error.error === 'object' && error.error.message) {
        return error.error.message
      }
      return JSON.stringify(error.error)
    }
    if (error.message) {
      return error.message
    }
    try {
      return `Microsoft Excel API error: ${JSON.stringify(error)}`
    } catch (_e) {
      return 'Microsoft Excel API error: Unable to parse error details'
    }
  }
  return 'An error occurred while reading from Microsoft Excel'
}