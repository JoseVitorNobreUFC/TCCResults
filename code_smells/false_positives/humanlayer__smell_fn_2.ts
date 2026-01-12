// @ts-nocheck
const getSendButtonText = () => {
  if (isDraft) return isLaunchingDraft ? 'Launching...' : 'Launch'
  if (isResponding) return 'Interrupting...'
  if (isDenying) return youSure ? 'Deny?' : 'Deny'
  const isRunning =
    session.status === SessionStatus.Running || session.status === SessionStatus.Starting
  const hasText = !isResponseEditorEmpty
  const canInterrupt = debouncedCanInterrupt 
  if (session.archived && isRunning) {
    return 'Interrupt & Unarchive'
  }
  if (session.archived) return 'Send & Unarchive'
  if (isRunning && !hasText) {
    if (!canInterrupt) return 'Waiting...'
    return 'Interrupt'
  }
  if (isRunning && hasText) {
    return canInterrupt ? 'Interrupt & Send' : 'Waiting...'
  }
  return 'Send'
}