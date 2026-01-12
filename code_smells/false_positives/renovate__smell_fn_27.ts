// @ts-nocheck
export function extractLockFileEntries(
  lockFileContent: string,
): Map<string, string> {
  const gemLock = new Map<string, string>();
  try {
    const platforms = extractPlatforms(lockFileContent);
    let inGemSection = false;
    for (const line of lockFileContent.split(newlineRegex)) {
      const trimmed = line.trim();
      const indent = line.indexOf(trimmed);
      if (indent === 0 && trimmed === 'GEM') {
        inGemSection = true;
      } else if (indent === 0 && trimmed && inGemSection) {
        inGemSection = false;
      } else if (indent === 4 && inGemSection) {
        const version = line.match(DEP_REGEX)?.groups?.version;
        if (version) {
          const name = line.replace(`(${version})`, '').trim();
          const cleanedVersion = stripPlatformSuffix(version, platforms);

          if (!gemLock.has(name) && isVersion(cleanedVersion)) {
            gemLock.set(name, cleanedVersion);
          }
        }
      }
    }
  } catch (err) {
    logger.warn({ err }, `Failed to parse Bundler lockfile`);
  }
  return gemLock;
}