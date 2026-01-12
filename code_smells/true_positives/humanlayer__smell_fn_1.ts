// @ts-nocheck
const handleConfirmDiscard = async () => {
  try {
    if (draftsToDiscard.length === 1) {
      const sessionId = draftsToDiscard[0]
      const currentSession = sessions.find(s => s.id === sessionId)
      await daemonClient.deleteDraftSession(sessionId)
      useStore.getState().removeSession(sessionId)
      const currentIndex = sessions.findIndex(s => s.id === sessionId)
      let nextFocusSession = null
      if (currentIndex > 0) {
        nextFocusSession = sessions[currentIndex - 1]
      } else if (currentIndex < sessions.length - 1) {
        nextFocusSession = sessions[currentIndex + 1]
      }
      if (nextFocusSession && handleFocusSession) {
        handleFocusSession(nextFocusSession)
      }
      toast.success('Draft discarded', {
        description: currentSession?.summary || 'Untitled draft',
        duration: 3000,
      })
    } else {
      const nonSelectedSessions = sessions.filter(s => !draftsToDiscard.includes(s.id))
      const nextFocusSession = nonSelectedSessions.length > 0 ? nonSelectedSessions[0] : null
      await bulkDiscardDrafts(draftsToDiscard)
      if (nextFocusSession && handleFocusSession) {
        handleFocusSession(nextFocusSession)
      }
      toast.success(`Discarded ${draftsToDiscard.length} drafts`, {
        duration: 3000,
      })
    }
    await useStore.getState().refreshSessions()
  } catch (error) {
    toast.error('Failed to discard draft(s)', {
      description: error instanceof Error ? error.message : 'Unknown error',
    })
  } finally {
    setDiscardDialogOpen(false)
    setDraftsToDiscard([])
  }
}