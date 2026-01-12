// @ts-nocheck
export async function getYarnLock(filePath: string): Promise<LockFile> {
  const yarnLockRaw = (await readLocalFile(filePath, 'utf8'))!;
  try {
    const parsed = parseSyml(yarnLockRaw);
    const lockedVersions: Record<string, string> = {};
    let lockfileVersion: number | undefined;
    for (const [key, val] of Object.entries(parsed)) {
      if (key === '__metadata') {
        lockfileVersion = parseInt(val.cacheKey);
        logger.once.debug(
          `yarn.lock ${filePath} has __metadata.cacheKey=${lockfileVersion}`,
        );
      } else {
        for (const entry of key.split(', ')) {
          try {
            const { scope, name, range } = structUtils.parseDescriptor(entry);
            const packageName = scope ? `@${scope}/${name}` : name;
            const { selector } = structUtils.parseRange(range);
            logger.trace({ entry, version: val.version });
            lockedVersions[packageName + '@' + selector] = parsed[key].version;
          } catch (err) {
            logger.debug(
              { entry, err },
              'Invalid descriptor or range found in yarn.lock',
            );
          }
        }
      }
    }
    const isYarn1 = !('__metadata' in parsed);
    if (isYarn1) {
      logger.once.debug(
        `yarn.lock ${filePath} is has no __metadata so is yarn 1`,
      );
    } else {
      logger.once.debug(
        `yarn.lock ${filePath} is has __metadata so is yarn 2+`,
      );
    }
    return {
      isYarn1,
      lockfileVersion,
      lockedVersions,
    };
  } catch (err) {
    logger.debug({ filePath, err }, 'Warning: Exception parsing yarn.lock');
    return { isYarn1: true, lockedVersions: {} };
  }
}