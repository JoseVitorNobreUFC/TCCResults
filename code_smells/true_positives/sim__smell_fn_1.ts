// @ts-nocheck
export async function persistExecutionLogs(
  activeWorkflowId: string,
  executionId: string,
  result: ExecutionResult,
  streamContent?: string
): Promise<string> {
  try {
    const { traceSpans, totalDuration } = buildTraceSpans(result)
    const enrichedResult = {
      ...result,
      traceSpans,
      totalDuration,
    }
    if (streamContent && result.output && typeof streamContent === 'string') {
      enrichedResult.output.content = streamContent
      if (enrichedResult.logs) {
        const streamingBlockId = (result.metadata as any)?.streamingBlockId || null
        for (const log of enrichedResult.logs) {
          const isStreamingBlock = streamingBlockId && log.blockId === streamingBlockId
          if (
            isStreamingBlock &&
            (log.blockType === 'agent' || log.blockType === 'router') &&
            log.output
          ) {
            log.output.content = streamContent
          }
        }
      }
    }
    const response = await fetch(`/api/workflows/${activeWorkflowId}/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        executionId,
        result: enrichedResult,
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to persist logs')
    }
    return executionId
  } catch (error) {
    logger.error('Error persisting logs:', error)
    return executionId
  }
}