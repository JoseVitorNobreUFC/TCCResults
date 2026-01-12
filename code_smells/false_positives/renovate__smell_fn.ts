// @ts-nocheck
export function detectPlatform(
  url: string,
):
  | 'azure'
  | 'bitbucket'
  | 'bitbucket-server'
  | 'forgejo'
  | 'gitea'
  | 'github'
  | 'gitlab'
  | null {
  const { hostname } = parseUrl(url) ?? {};
  if (hostname === 'dev.azure.com' || hostname?.endsWith('.visualstudio.com')) {
    return 'azure';
  }
  if (hostname === 'bitbucket.org' || hostname === 'bitbucket.com') {
    return 'bitbucket';
  }
  if (hostname?.includes('bitbucket')) {
    return 'bitbucket-server';
  }
  if (hostname?.includes('forgejo')) {
    return 'forgejo';
  }
  if (hostname && ['codeberg.org', 'codefloe.com'].includes(hostname)) {
    return 'forgejo';
  }
  if (
    hostname &&
    (['gitea.com'].includes(hostname) || hostname.includes('gitea'))
  ) {
    return 'gitea';
  }
  if (hostname === 'github.com' || hostname?.includes('github')) {
    return 'github';
  }
  if (hostname === 'gitlab.com' || hostname?.includes('gitlab')) {
    return 'gitlab';
  }
  const hostType = hostRules.hostType({ url });
  if (!hostType) {
    return null;
  }
  if (AZURE_API_USING_HOST_TYPES.includes(hostType)) {
    return 'azure';
  }
  if (BITBUCKET_SERVER_API_USING_HOST_TYPES.includes(hostType)) {
    return 'bitbucket-server';
  }
  if (BITBUCKET_API_USING_HOST_TYPES.includes(hostType)) {
    return 'bitbucket';
  }
  if (FORGEJO_API_USING_HOST_TYPES.includes(hostType)) {
    return 'forgejo';
  }
  if (GITEA_API_USING_HOST_TYPES.includes(hostType)) {
    return 'gitea';
  }
  if (GITHUB_API_USING_HOST_TYPES.includes(hostType)) {
    return 'github';
  }
  if (GITLAB_API_USING_HOST_TYPES.includes(hostType)) {
    return 'gitlab';
  }
  return null;
}