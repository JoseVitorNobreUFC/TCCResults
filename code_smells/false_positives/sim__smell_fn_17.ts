// @ts-nocheck
const handleExecutionError = (error: any) => {
  let errorMessage = 'Unknown error'
  if (error instanceof Error) {
    errorMessage = error.message || `Error: ${String(error)}`
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object') {
    if (
      error.message === 'undefined (undefined)' ||
      (error.error &&
        typeof error.error === 'object' &&
        error.error.message === 'undefined (undefined)')
    ) {
      errorMessage = 'API request failed - no specific error details available'
    } else if (error.message) {
      errorMessage = error.message
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error
    } else if (error.error && typeof error.error === 'object' && error.error.message) {
      errorMessage = error.error.message
    } else {
      try {
        errorMessage = `Error details: ${JSON.stringify(error)}`
      } catch {
        errorMessage = 'Error occurred but details could not be displayed'
      }
    }
  }
  if (errorMessage === 'undefined (undefined)') {
    errorMessage = 'API request failed - no specific error details available'
  }
  const errorResult: ExecutionResult = {
    success: false,
    output: {},
    error: errorMessage,
    logs: [],
  }
  setExecutionResult(errorResult)
  setIsExecuting(false)
  setIsDebugging(false)
  setActiveBlocks(new Set())
  let notificationMessage = 'Workflow execution failed'
  if (error?.request?.url) {
    if (error.request.url && error.request.url.trim() !== '') {
      notificationMessage += `: Request to ${error.request.url} failed`
      if (error.status) {
        notificationMessage += ` (Status: ${error.status})`
      }
    }
  } else {
    notificationMessage += `: ${errorMessage}`
  }
  return errorResult
}