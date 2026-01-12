// @ts-nocheck
const handleAction = async (action: 'run' | 'skip' | 'background') => {
  if (isProcessing) return
  setButtonsHidden(true)
  if (action === 'background') {
    setIsMovingToBackground(true)
  } else {
    setIsProcessing(true)
  }
  try {
    if (onConfirm) {
      onConfirm()
    }
    const isClientTool = toolRegistry.getTool(toolCall.name) !== undefined
    if (isClientTool) {
      await executeToolWithStateManagement(toolCall, action, {
        onStateChange,
        context,
      })
    } else {
      const toolState =
        action === 'run' ? 'accepted' : action === 'background' ? 'background' : 'rejected'
      const uiState =
        action === 'run' ? 'accepted' : action === 'background' ? 'background' : 'rejected'
      onStateChange(uiState)
      try {
        await notifyServerTool(toolCall.id, toolCall.name, toolState)
      } catch (error) {
        console.error(`Failed to notify server tool ${toolCall.id}:`, error)
        if (action === 'skip') {
          return
        }
        throw error
      }
    }
  } finally {
    setIsProcessing(false)
    setIsMovingToBackground(false)
  }
}