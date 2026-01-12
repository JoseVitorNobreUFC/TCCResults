// @ts-nocheck
setConfig: config => {
  if (config.provider) {
    localStorage.setItem(PROVIDER_KEY, config.provider)
  }
  if (config.model !== undefined) {
    const modelKey =
      config.provider === 'anthropic'
        ? MODEL_KEY
        : config.provider === 'openrouter'
          ? OPENROUTER_MODEL_KEY
          : config.provider === 'baseten'
            ? BASETEN_MODEL_KEY
            : null

    if (modelKey) {
      if (config.model) {
        localStorage.setItem(modelKey, config.model)
      } else {
        localStorage.removeItem(modelKey)
      }
    }
  }
  if (config.openRouterApiKey) {
    localStorage.setItem(OPENROUTER_API_KEY, config.openRouterApiKey)
  } else if (
    config.openRouterApiKey === undefined ||
    config.openRouterApiKey === null ||
    config.openRouterApiKey === ''
  ) {
    localStorage.removeItem(OPENROUTER_API_KEY)
  }
  if (config.basetenApiKey) {
    localStorage.setItem(BASETEN_API_KEY, config.basetenApiKey)
  } else if (
    config.basetenApiKey === undefined ||
    config.basetenApiKey === null ||
    config.basetenApiKey === ''
  ) {
    localStorage.removeItem(BASETEN_API_KEY)
  }
  if (config.additionalDirectories && config.additionalDirectories.length > 0) {
    localStorage.setItem(ADDITIONAL_DIRECTORIES_KEY, JSON.stringify(config.additionalDirectories))
  } else if (
    config.additionalDirectories === undefined ||
    config.additionalDirectories === null ||
    (Array.isArray(config.additionalDirectories) && config.additionalDirectories.length === 0)
  ) {
    localStorage.removeItem(ADDITIONAL_DIRECTORIES_KEY)
  }
  return set({ config, error: undefined })
}