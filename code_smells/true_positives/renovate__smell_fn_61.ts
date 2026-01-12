// @ts-nocheck
async function getReleases(config: GetReleasesConfig): Promise<ReleaseResult | null> {
  const { packageName } = config;
  logger.trace(`goproxy.getReleases(${packageName})`);
  const goproxy = getEnv().GOPROXY ?? 'https://proxy.golang.org,direct';
  if (goproxy === 'direct') {
    return this.direct.getReleases(config);
  }
  const proxyList = parseGoproxy(goproxy);
  const noproxy = parseNoproxy();
  let result: ReleaseResult | null = null;
  if (noproxy?.test(packageName)) {
    logger.debug(`Fetching ${packageName} via GONOPROXY match`);
    result = await this.direct.getReleases(config);
    return result;
  }
  for (const { url, fallback } of proxyList) {
    try {
      if (url === 'off') {
        break;
      } else if (url === 'direct') {
        result = await this.direct.getReleases(config);
        break;
      }
      const res = await this.getVersionsWithInfo(url, packageName);
      if (res.releases.length) {
        result = res;
        break;
      }
    } catch (err) {
      const potentialHttpError =
        err instanceof ExternalHostError ? err.err : err;
      const statusCode = potentialHttpError?.response?.statusCode;
      const canFallback =
        fallback === '|' ? true : statusCode === 404 || statusCode === 410;
      const msg = canFallback
        ? 'Goproxy error: trying next URL provided with GOPROXY'
        : 'Goproxy error: skipping other URLs provided with GOPROXY';
      logger.debug({ err }, msg);
      if (!canFallback) {
        break;
      }
    }
  }
  if (result && !result.sourceUrl) {
    try {
      const datasource = await BaseGoDatasource.getDatasource(packageName);
      const sourceUrl = getSourceUrl(datasource);
      if (sourceUrl) {
        result.sourceUrl = sourceUrl;
      }
    } catch (err) {
      logger.trace({ err }, `Can't get datasource for ${packageName}`);
    }
  }
  return result;
}