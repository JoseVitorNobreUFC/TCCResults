// @ts-nocheck
async function fetchReleases(
  config: GetReleasesInternalConfig,
): Promise<ReleaseResult | null> {
  const { datasource: datasourceName } = config;
  let { registryUrls } = config;
  if (!datasourceName || getDatasourceFor(datasourceName) === undefined) {
    logger.warn({ datasource: datasourceName }, 'Unknown datasource');
    return null;
  }
  if (datasourceName === 'npm') {
    if (isString(config.npmrc)) {
      setNpmrc(config.npmrc);
    }
    if (!isNonEmptyArray(registryUrls)) {
      registryUrls = [resolveRegistryUrl(config.packageName)];
    }
  }
  const datasource = getDatasourceFor(datasourceName);
  if (!datasource) {
    logger.warn({ datasource: datasourceName }, 'Unknown datasource');
    return null;
  }
  registryUrls = resolveRegistryUrls(
    datasource,
    config.defaultRegistryUrls,
    registryUrls,
    config.additionalRegistryUrls,
  );
  let dep: ReleaseResult | null = null;
  const registryStrategy =
    config.registryStrategy ?? datasource.registryStrategy ?? 'hunt';
  try {
    if (isNonEmptyArray(registryUrls)) {
      if (registryStrategy === 'first') {
        dep = await firstRegistry(config, datasource, registryUrls);
      } else if (registryStrategy === 'hunt') {
        dep = await huntRegistries(config, datasource, registryUrls);
      } else if (registryStrategy === 'merge') {
        dep = await mergeRegistries(config, datasource, registryUrls);
      }
    } else {
      dep = await datasource.getReleases(config);
    }
  } catch (err) {
    if (err.message === HOST_DISABLED || err.err?.message === HOST_DISABLED) {
      return null;
    }
    if (err instanceof ExternalHostError) {
      throw err;
    }
    logError(datasource.id, config.packageName, err);
  }
  if (!dep || dequal(dep, { releases: [] })) {
    return null;
  }
  addMetaData(dep, datasourceName, config.packageName);
  dep = { ...dep, ...applyReplacements(config) };
  return dep;
}