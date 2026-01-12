// @ts-nocheck
const handleRemoveAllFiles = async (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (!value) return
  const filesToDelete = Array.isArray(value) ? value : [value]
  const _fileCount = filesToDelete.length
  const deletingStatus: Record<string, boolean> = {}
  filesToDelete.forEach((file) => {
    deletingStatus[file.path] = true
  })
  setDeletingFiles(deletingStatus)
  setStoreValue(null)
  useWorkflowStore.getState().triggerUpdate()
  if (fileInputRef.current) {
    fileInputRef.current.value = ''
  }
  const deletionResults = {
    success: 0,
    failures: [] as string[],
  }
  for (const file of filesToDelete) {
    try {
      const response = await fetch('/api/files/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: file.path }),
      })

      if (response.ok) {
        deletionResults.success++
      } else {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        const errorMessage = errorData.error || `Failed to delete file: ${response.status}`
        deletionResults.failures.push(`${file.name}: ${errorMessage}`)
      }
    } catch (error) {
      console.error(`Failed to delete file ${file.name}:`, error)
      deletionResults.failures.push(
        `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
  if (deletionResults.failures.length > 0) {
    if (deletionResults.failures.length === 1) {
      logger.error(`Failed to delete file: ${deletionResults.failures[0]}`, activeWorkflowId)
    } else {
      logger.error(
        `Failed to delete ${deletionResults.failures.length} files: ${deletionResults.failures.join('; ')}`,
        activeWorkflowId
      )
    }
  }
  setDeletingFiles({})
}