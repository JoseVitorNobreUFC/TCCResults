// @ts-nocheck
sortedLogs.forEach((log) => {
  if (!log.blockId || !log.blockType) return
  const spanId = `${log.blockId}-${new Date(log.startedAt).getTime()}`
  const span = spanMap.get(spanId)
  if (!span) return
  if (spanStack.length > 0) {
    const potentialParent = spanStack[spanStack.length - 1]
    const parentStartTime = new Date(potentialParent.startTime).getTime()
    const parentEndTime = new Date(potentialParent.endTime).getTime()
    const spanStartTime = new Date(span.startTime).getTime()
    if (spanStartTime >= parentStartTime && spanStartTime <= parentEndTime) {
      if (!potentialParent.children) potentialParent.children = []
      potentialParent.children.push(span)
    } else {
      while (
        spanStack.length > 0 &&
        new Date(spanStack[spanStack.length - 1].endTime).getTime() < spanStartTime
      ) {
        spanStack.pop()
      }
      if (spanStack.length > 0) {
        const newParent = spanStack[spanStack.length - 1]
        if (!newParent.children) newParent.children = []
        newParent.children.push(span)
      } else {
        rootSpans.push(span)
      }
    }
  } else {
    rootSpans.push(span)
  }
  if (log.blockType === 'agent' || log.blockType === 'workflow') {
    spanStack.push(span)
  }
})