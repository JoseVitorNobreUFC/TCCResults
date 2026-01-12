// @ts-nocheck
async function getReleases({
  packageName,
  registryUrl,
}: GetReleasesConfig): Promise<ReleaseResult | null> {
  logger.trace(`getReleases(${packageName})`);
  if (!registryUrl) {
    return null;
  }
  try {
    const meta = await this.getRegistryMeta(registryUrl);
    if (
      meta.availablePackages &&
      !meta.availablePackages.includes(packageName)
    ) {
      return null;
    }
    if (meta.metadataUrl) {
      const packagistResult = await this.packagistV2Lookup(
        registryUrl,
        meta.metadataUrl,
        packageName,
      );
      return packagistResult;
    }
    if (meta.packages[packageName]) {
      const result = extractDepReleases(meta.packages[packageName]);
      return result;
    }
    await this.fetchIncludesPackages(registryUrl, meta);
    if (meta.includesPackages[packageName]) {
      return meta.includesPackages[packageName];
    }
    await this.fetchProviderPackages(registryUrl, meta);
    const pkgUrl = this.getPkgUrl(packageName, registryUrl, meta);
    if (!pkgUrl) {
      return null;
    }
    const pkgRes = await this.getJson(pkgUrl, PackagesResponse);
    const dep = extractDepReleases(pkgRes.packages[packageName]);
    logger.trace({ dep }, 'dep');
    return dep;
  } catch (err) {
    if (err.host === 'packagist.org') {
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        throw new ExternalHostError(err);
      }
      if (err.statusCode && err.statusCode >= 500 && err.statusCode < 600) {
        throw new ExternalHostError(err);
      }
    }
    throw err;
  }
}