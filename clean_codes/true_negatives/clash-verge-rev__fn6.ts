// @ts-nocheck
export const preloadLanguage = async (
  vergeConfig?: IVergeConfig | null,
  loadConfig: () => Promise<IVergeConfig | null> = preloadConfig,
) => {
  const cachedLanguage = getCachedLanguage();
  if (cachedLanguage) {
    return cachedLanguage;
  }
  let resolvedConfig = vergeConfig;
  if (resolvedConfig === undefined) {
    try {
      resolvedConfig = await loadConfig();
    } catch (error) {
      console.warn(
        `[preload.ts] Failed to read language from Verge config:`,
        error,
      );
      resolvedConfig = null;
    }
  }
  const languageFromConfig = resolvedConfig?.language;
  if (languageFromConfig) {
    const resolved = resolveLanguage(languageFromConfig);
    cacheLanguage(resolved);
    return resolved;
  }
  const browserLanguage = resolveLanguage(
    typeof navigator !== `undefined` ? navigator.language : undefined,
  );
  cacheLanguage(browserLanguage);
  return browserLanguage;
};