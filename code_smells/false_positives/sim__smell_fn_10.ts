// @ts-nocheck
export function getServiceIdFromScopes(provider: OAuthProvider, scopes: string[]): string {
  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig) {
    return provider
  }
  if (provider === 'google') {
    if (scopes.some((scope) => scope.includes('gmail') || scope.includes('mail'))) {
      return 'gmail'
    }
    if (scopes.some((scope) => scope.includes('drive'))) {
      return 'google-drive'
    }
    if (scopes.some((scope) => scope.includes('docs'))) {
      return 'google-docs'
    }
    if (scopes.some((scope) => scope.includes('sheets'))) {
      return 'google-sheets'
    }
    if (scopes.some((scope) => scope.includes('calendar'))) {
      return 'google-calendar'
    }
  } else if (provider === 'microsoft-teams') {
    return 'microsoft-teams'
  } else if (provider === 'outlook') {
    return 'outlook'
  } else if (provider === 'github') {
    return 'github'
  } else if (provider === 'supabase') {
    return 'supabase'
  } else if (provider === 'x') {
    return 'x'
  } else if (provider === 'confluence') {
    return 'confluence'
  } else if (provider === 'jira') {
    return 'jira'
  } else if (provider === 'airtable') {
    return 'airtable'
  } else if (provider === 'notion') {
    return 'notion'
  } else if (provider === 'discord') {
    return 'discord'
  } else if (provider === 'linear') {
    return 'linear'
  } else if (provider === 'slack') {
    return 'slack'
  } else if (provider === 'reddit') {
    return 'reddit'
  } else if (provider === 'wealthbox') {
    return 'wealthbox'
  }
  return providerConfig.defaultService
}