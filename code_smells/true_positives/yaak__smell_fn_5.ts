// @ts-nocheck
export function resolvedModelName(r: AnyModel | null): string {
  if (r == null) return '';
  if (!('url' in r) || r.model === 'plugin') {
    return 'name' in r ? r.name : '';
  }
  if ('name' in r && r.name) {
    return r.name;
  }
  const withoutVariables = r.url.replace(/\$\{\[\s*([^\]\s]+)\s*]}/g, '$1');
  if (withoutVariables.trim() === '') {
    return r.model === 'http_request'
      ? r.bodyType && r.bodyType === 'graphql'
        ? 'GraphQL Request'
        : 'HTTP Request'
      : r.model === 'websocket_request'
        ? 'WebSocket Request'
        : 'gRPC Request';
  }
  if (r.model === 'grpc_request' && r.service != null && r.method != null) {
    const shortService = r.service.split('.').pop();
    return `${shortService}/${r.method}`;
  }
  const withoutProto = withoutVariables.replace(/^(http|https|ws|wss):\/\//, '');
  return withoutProto;
}