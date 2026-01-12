// @ts-nocheck
vi.fn().mockImplementation(async (context) => {
  for (const [parallelId, parallel] of Object.entries(context.workflow?.parallels || {})) {
    if (context.completedLoops.has(parallelId)) {
      continue
    }
    const parallelState = context.parallelExecutions?.get(parallelId)
    if (!parallelState || parallelState.currentIteration === 0) {
      continue
    }
    const checkCount = executionCounts.get(parallelId) || 0
    executionCounts.set(parallelId, checkCount + 1)
    if (checkCount >= maxChecks) {
      context.completedLoops.add(parallelId)
      continue
    }
    let allVirtualBlocksExecuted = true
    const parallelNodes = (parallel as any).nodes || []
    for (const nodeId of parallelNodes) {
      for (let i = 0; i < parallelState.parallelCount; i++) {
        const virtualBlockId = `${nodeId}_parallel_${parallelId}_iteration_${i}`
        if (!context.executedBlocks.has(virtualBlockId)) {
          allVirtualBlocksExecuted = false
          break
        }
      }
      if (!allVirtualBlocksExecuted) break
    }
    if (allVirtualBlocksExecuted && !context.completedLoops.has(parallelId)) {
      context.executedBlocks.delete(parallelId)
      context.activeExecutionPath.add(parallelId)

      for (const nodeId of parallelNodes) {
        context.activeExecutionPath.delete(nodeId)
      }
    }
  }
})