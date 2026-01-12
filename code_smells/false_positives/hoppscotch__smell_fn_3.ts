// @ts-nocheck
export function safelyExtractRESTRequest(
  x: unknown,
  defaultReq: HoppRESTRequest
): HoppRESTRequest {
  const req = cloneDeep(defaultReq)
  if (!!x && typeof x === 'object') {
    if ('id' in x && typeof x.id === 'string') req.id = x.id
    if ('name' in x && typeof x.name === 'string') req.name = x.name
    if ('method' in x && typeof x.method === 'string') req.method = x.method
    if ('endpoint' in x && typeof x.endpoint === 'string')
      req.endpoint = x.endpoint
    if ('preRequestScript' in x && typeof x.preRequestScript === 'string')
      req.preRequestScript = x.preRequestScript
    if ('testScript' in x && typeof x.testScript === 'string')
      req.testScript = x.testScript
    if ('body' in x) {
      const result = HoppRESTReqBody.safeParse(x.body)
      if (result.success) {
        req.body = result.data
      }
    }
    if ('auth' in x) {
      const result = HoppRESTAuth.safeParse(x.auth)
      if (result.success) {
        req.auth = result.data
      }
    }
    if ('params' in x) {
      const result = HoppRESTParams.safeParse(x.params)

      if (result.success) {
        req.params = result.data
      }
    }
    if ('headers' in x) {
      const result = HoppRESTHeaders.safeParse(x.headers)
      if (result.success) {
        req.headers = result.data
      }
    }
    if ('requestVariables' in x) {
      const result = HoppRESTRequestVariables.safeParse(x.requestVariables)

      if (result.success) {
        req.requestVariables = result.data
      }
    }
    if ('responses' in x) {
      const result = HoppRESTRequestResponses.safeParse(x.responses)
      if (result.success) {
        req.responses = result.data
      }
    }
  }
  return req
}