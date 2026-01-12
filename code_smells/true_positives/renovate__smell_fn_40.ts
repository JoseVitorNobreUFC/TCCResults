// @ts-nocheck
export async function clearRenovateRefs(): Promise<void> {
  if (!gitInitialized || !remoteRefsExist) {
    return;
  }
  logger.debug(`Cleaning up Renovate refs: refs/renovate/branches/*`);
  const renovateRefs: string[] = [];
  try {
    const rawOutput = await git.listRemote([
      config.url,
      'refs/renovate/branches/*',
    ]);
    const refs = rawOutput
      .split(newlineRegex)
      .map((line) => line.replace(regEx(/[0-9a-f]+\s+/i), '').trim())
      .filter((line) => line.startsWith('refs/renovate/branches/'));
    renovateRefs.push(...refs);
  } catch (err) {
    logger.warn({ err }, `Renovate refs cleanup error`);
  }
  if (renovateRefs.length) {
    try {
      const pushOpts = ['--delete', 'origin', ...renovateRefs];
      await git.push(pushOpts);
    } catch (err) {
      if (bulkChangesDisallowed(err)) {
        for (const ref of renovateRefs) {
          try {
            const pushOpts = ['--delete', 'origin', ref];
            await git.push(pushOpts);
          } catch (err) {
            logger.debug({ err }, 'Error deleting `refs/renovate/branches/*`');
            break;
          }
        }
      } else {
        logger.warn({ err }, 'Error deleting `refs/renovate/branches/*`');
      }
    }
  }
  remoteRefsExist = false;
}