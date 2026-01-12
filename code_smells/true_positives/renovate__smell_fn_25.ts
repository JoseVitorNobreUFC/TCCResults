// @ts-nocheck
export async function extract(
  config: RenovateConfig,
  overwriteCache = true,
): Promise<Record<string, PackageFile[]>> {
  logger.debug('extract()');
  const { baseBranch } = config;
  const baseBranchSha = await scm.getBranchCommit(baseBranch!);
  let packageFiles: Record<string, PackageFile[]>;
  const cache = getCache();
  cache.scan ??= {};
  const cachedExtract = cache.scan[baseBranch!];
  const configHash = fingerprint(generateFingerprintConfig(config));
  if (
    overwriteCache &&
    isCacheExtractValid(baseBranchSha!, configHash, cachedExtract)
  ) {
    packageFiles = cachedExtract.packageFiles;
    try {
      for (const files of Object.values(packageFiles)) {
        for (const file of files) {
          for (const dep of file.deps) {
            delete dep.updates;
          }
        }
      }
      logger.debug('Deleted cached dep updates');
    } catch (err) {
      logger.info({ err }, 'Error deleting cached dep updates');
    }
  } else {
    await scm.checkoutBranch(baseBranch!);
    const extractResult = (await extractAllDependencies(config)) || {};
    packageFiles = extractResult.packageFiles;
    const { extractionFingerprints } = extractResult;
    if (overwriteCache) {
      cache.scan[baseBranch!] = {
        revision: EXTRACT_CACHE_REVISION,
        sha: baseBranchSha!,
        configHash,
        extractionFingerprints,
        packageFiles,
      };
    }
    const baseBranches = isNonEmptyArray(config.baseBranches)
      ? config.baseBranches
      : [baseBranch];
    Object.keys(cache.scan).forEach((branchName) => {
      if (!baseBranches.includes(branchName)) {
        delete cache.scan![branchName];
      }
    });
  }
  const stats = extractStats(packageFiles);
  logger.info(
    { baseBranch: config.baseBranch, stats },
    `Dependency extraction complete`,
  );
  logger.trace({ config: packageFiles }, 'packageFiles');
  ensureGithubToken(packageFiles);
  return packageFiles;
}