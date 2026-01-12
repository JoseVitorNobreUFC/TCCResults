// @ts-nocheck
function hasCommonConfigSnippet(config: any, commonConfig: any): boolean {
  if (typeof config !== 'object' || config === null) return false;
  if (typeof commonConfig !== 'object' || commonConfig === null) return false;
  for (const key of Object.keys(commonConfig)) {
    if (config[key] === undefined) return false;
    if (JSON.stringify(config[key]) !== JSON.stringify(commonConfig[key])) {
      if (
        typeof config[key] === 'object' &&
        !Array.isArray(config[key]) &&
        typeof commonConfig[key] === 'object' &&
        !Array.isArray(commonConfig[key])
      ) {
        if (!hasCommonConfigSnippet(config[key], commonConfig[key])) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}