// @ts-nocheck
() => {
  if (!focusedEventId) return
  startKeyboardNavigation?.()
  const focusedEvent = events.find(e => e.id === focusedEventId)
  if (!focusedEvent || focusedEvent.eventType !== ConversationEventType.ToolCall) return
  if (focusedEvent.toolName === 'Task' && focusedEvent.toolInputJson && setExpandedToolCall) {
    try {
      const taskInput = JSON.parse(focusedEvent.toolInputJson)
      if (taskInput.subagent_type && taskInput.subagent_type !== 'Task') {
        setExpandedToolCall(focusedEvent)
        return
      }
    } catch (e) {
      console.error('Failed to parse task input:', e)
    }
  }
  if (focusedEvent.toolName === 'Task' && focusedEvent.toolId && hasSubTasks) {
    const subEventsByParent = new Map<string, ConversationEvent[]>()
    events.forEach(event => {
      if (event.parentToolUseId) {
        const siblings = subEventsByParent.get(event.parentToolUseId) || []
        siblings.push(event)
        subEventsByParent.set(event.parentToolUseId, siblings)
      }
    })
    const hasSubEvents = subEventsByParent.has(focusedEvent.toolId)
    if (hasSubEvents) {
      toggleTaskGroup(focusedEvent.toolId)
      return
    }
  }
  if (setExpandedToolResult && setExpandedToolCall) {
    const toolResult = focusedEvent.toolId
      ? events.find(
        e =>
          e.eventType === ConversationEventType.ToolResult &&
          e.toolResultForId === focusedEvent.toolId,
      )
      : null
    setExpandedToolResult(toolResult || null)
    setExpandedToolCall(focusedEvent)
  }
}