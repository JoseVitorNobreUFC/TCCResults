// @ts-nocheck
function resolveEnvVariables(value: any, isApiKey = false): any {
  if (typeof value === 'string') {
    const isExplicitEnvVar = value.trim().startsWith('{{') && value.trim().endsWith('}}')
    const hasProperEnvVarReferences = this.containsProperEnvVarReference(value)
    if (isApiKey || isExplicitEnvVar || hasProperEnvVarReferences) {
      const envMatches = value.match(/\{\{([^}]+)\}\}/g)
      if (envMatches) {
        let resolvedValue = value
        for (const match of envMatches) {
          const envKey = match.slice(2, -2)
          const envValue = this.environmentVariables[envKey]

          if (envValue === undefined) {
            throw new Error(`Environment variable '${envKey}' was not found.`)
          }

          resolvedValue = resolvedValue.replace(match, envValue)
        }
        return resolvedValue
      }
    }
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => this.resolveEnvVariables(item, isApiKey))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: this.resolveEnvVariables(v, k.toLowerCase() === 'apikey'),
      }),
      {}
    )
  }
  return value
}