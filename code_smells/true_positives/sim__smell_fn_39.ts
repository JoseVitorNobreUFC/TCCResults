// @ts-nocheck
const handleKeyDown = (e: React.KeyboardEvent) => {
  const isSchemaPromptVisible = activeSection === 'schema' && schemaGeneration.isPromptVisible
  const isCodePromptVisible = activeSection === 'code' && codeGeneration.isPromptVisible
  if (e.key === 'Escape') {
    if (isSchemaPromptVisible) {
      schemaGeneration.hidePromptInline()
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (isCodePromptVisible) {
      codeGeneration.hidePromptInline()
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (!showEnvVars && !showTags) {
      setShowEnvVars(false)
      setShowTags(false)
    }
  }
  if (activeSection === 'schema' && schemaGeneration.isStreaming) {
    e.preventDefault()
    return
  }
  if (activeSection === 'code' && codeGeneration.isStreaming) {
    e.preventDefault()
    return
  }
  if (showEnvVars || showTags) {
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}