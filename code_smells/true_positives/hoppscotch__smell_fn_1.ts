// @ts-nocheck
function constructProxyRequest(
  request: RelayRequest,
  accessToken: string
): ProxyRequest {
  const wantsBinary = true
  let requestData: any = null
  if (request.content) {
    switch (request.content.kind) {
      case 'json':
        requestData =
          typeof request.content.content === 'string'
            ? request.content.content
            : JSON.stringify(request.content.content)
        break

      case 'binary':
        if (
          request.content.content instanceof Blob ||
          request.content.content instanceof File
        ) {
          requestData = request.content.content
        } else if (typeof request.content.content === 'string') {
          try {
            const base64 =
              request.content.content.split(',')[1] || request.content.content
            const binaryString = window.atob(base64)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            requestData = new Blob([bytes.buffer])
          } catch (e) {
            console.error('Error converting binary data:', e)
            requestData = request.content.content
          }
        } else {
          requestData = request.content.content
        }
        break
      case 'multipart':
        requestData = ''
        break
      default:
        requestData = request.content.content
    }
  }
  return {
    accessToken,
    wantsBinary,
    url: request.url,
    method: request.method,
    headers: request.headers,
    params: request.params,
    data: requestData,
    auth:
      request.auth?.kind === 'basic'
        ? {
          username: request.auth.username,
          password: request.auth.password,
        }
        : undefined,
  }
}