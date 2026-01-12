// @ts-nocheck
export async function extractDependencies(
  config: RenovateConfig,
  overwriteCache = true,
): Promise<ExtractResult> {
  await readDashboardBody(config);
  let res: ExtractResult = {
    branches: [],
    branchList: [],
    packageFiles: {},
  };
  if (
    GlobalConfig.get('platform') !== 'local' &&
    config.baseBranchPatterns?.length
  ) {
    config.baseBranches = unfoldBaseBranches(
      config.defaultBranch!,
      config.baseBranchPatterns,
    );
    logger.debug({ baseBranches: config.baseBranches }, 'baseBranches');
    const extracted: Record<string, Record<string, PackageFile[]>> = {};
    for (const baseBranch of config.baseBranches) {
      addMeta({ baseBranch });

      if (scm.syncForkWithUpstream) {
        await scm.syncForkWithUpstream(baseBranch);
      }
      if (await scm.branchExists(baseBranch)) {
        const baseBranchConfig = await getBaseBranchConfig(baseBranch, config);
        extracted[baseBranch] = await extract(baseBranchConfig, overwriteCache);
      } else {
        logger.warn({ baseBranch }, 'Base branch does not exist - skipping');
      }
    }
    addSplit('extract');
    for (const baseBranch of config.baseBranches) {
      if (await scm.branchExists(baseBranch)) {
        addMeta({ baseBranch });
        const baseBranchConfig = await getBaseBranchConfig(baseBranch, config);
        const packageFiles = extracted[baseBranch];
        const baseBranchRes = await lookup(baseBranchConfig, packageFiles);
        res.branches = res.branches.concat(baseBranchRes?.branches);
        res.branchList = res.branchList.concat(baseBranchRes?.branchList);
        if (!res.packageFiles || !Object.keys(res.packageFiles).length) {
          res.packageFiles = baseBranchRes?.packageFiles;
        }
      }
    }
    removeMeta(['baseBranch']);
  } else {
    logger.debug('No baseBranches');
    const packageFiles = await extract(config, overwriteCache);
    addSplit('extract');
    if (GlobalConfig.get('dryRun') === 'extract') {
      res.packageFiles = packageFiles;
      logger.info({ packageFiles }, 'Extracted dependencies');
      return res;
    }
    res = await lookup(config, packageFiles);
  }
  addSplit('lookup');
  return res;
}