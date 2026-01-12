// @ts-nocheck
export async function executeRequest(
  toolId: string,
  tool: ToolConfig,
  requestParams: RequestParams
): Promise<ToolResponse> {
  try {
    const { url, method, headers, body } = requestParams
    const externalResponse = await fetch(url, { method, headers, body })
    if (!externalResponse.ok) {
      let errorContent
      try {
        errorContent = await externalResponse.json()
      } catch (_e) {
        errorContent = { message: externalResponse.statusText }
      }
      if (tool.transformError) {
        try {
          const errorResult = tool.transformError(errorContent)
          if (typeof errorResult === 'string') {
            throw new Error(errorResult)
          }
          const transformedError = await errorResult
          if (typeof transformedError === 'string') {
            throw new Error(transformedError)
          }
          if (
            transformedError &&
            typeof transformedError === 'object' &&
            'error' in transformedError
          ) {
            throw new Error(transformedError.error || 'Tool returned an error')
          }
          throw new Error('Tool returned an error')
        } catch (e) {
          if (e instanceof Error) {
            throw e
          }
          throw new Error(`${toolId} API error: ${externalResponse.statusText}`)
        }
      } else {
        const error = errorContent.message || `${toolId} API error: ${externalResponse.statusText}`
        logger.error(`${toolId} error:`, { error })
        throw new Error(error)
      }
    }
    const transformResponse =
      tool.transformResponse ||
      (async (resp: Response) => ({
        success: true,
        output: await resp.json(),
      }))
    return await transformResponse(externalResponse)
  } catch (error: any) {
    return {
      success: false,
      output: {},
      error: error.message || 'Unknown error',
    }
  }
}