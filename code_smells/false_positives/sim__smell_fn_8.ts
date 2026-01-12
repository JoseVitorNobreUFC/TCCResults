// @ts-nocheck
const updatedEntries = state.entries.map((entry) => {
  const isMatch = entry.blockId === blockId && entry.executionId === executionId
  if (isMatch) {
    if (typeof update === 'string') {
      const newOutput = updateBlockOutput(entry.output, update)
      return { ...entry, output: newOutput }
    }
    const updatedEntry = { ...entry }
    if (update.content !== undefined) {
      const newOutput = updateBlockOutput(entry.output, update.content)
      updatedEntry.output = newOutput
    }
    if (update.replaceOutput !== undefined) {
      updatedEntry.output = update.replaceOutput
    } else if (update.output !== undefined) {
      const existingOutput = entry.output || {}
      updatedEntry.output = {
        ...existingOutput,
        ...update.output,
      }
    }
    if (update.error !== undefined) {
      updatedEntry.error = update.error
    }
    if (update.warning !== undefined) {
      updatedEntry.warning = update.warning
    }
    if (update.success !== undefined) {
      updatedEntry.success = update.success
    }
    if (update.endedAt !== undefined) {
      updatedEntry.endedAt = update.endedAt
    }
    if (update.durationMs !== undefined) {
      updatedEntry.durationMs = update.durationMs
    }
    if (update.input !== undefined) {
      updatedEntry.input = update.input
    }
    return updatedEntry
  }
  return entry
})