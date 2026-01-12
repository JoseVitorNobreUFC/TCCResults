// @ts-nocheck
export async function extractAllPackageFiles(
  _config: ExtractConfig,
  packageFiles: string[],
): Promise<PackageFile[]> {
  const packages: PackageFile[] = [];
  const proxyUrls: string[] = [];
  let ctxScalaVersion: string | undefined;
  const sortedPackageFiles = sortPackageFiles(packageFiles);
  for (const packageFile of sortedPackageFiles) {
    const content = await readLocalFile(packageFile, 'utf8');
    if (!content) {
      logger.debug({ packageFile }, 'packageFile has no content');
      continue;
    }
    if (packageFile === 'repositories') {
      const urls = extractProxyUrls(content, packageFile);
      proxyUrls.push(...urls);
    } else {
      const pkg = extractPackageFileInternal(
        content,
        packageFile,
        ctxScalaVersion,
      );
      if (pkg) {
        packages.push({ deps: pkg.deps, packageFile });
        if (pkg.managerData?.scalaVersion) {
          ctxScalaVersion = pkg.managerData.scalaVersion;
        }
      }
    }
  }
  for (const pkg of packages) {
    for (const dep of pkg.deps) {
      if (dep.datasource !== GithubReleasesDatasource.id) {
        if (proxyUrls.length > 0) {
          dep.registryUrls!.unshift(...proxyUrls);
        } else if (dep.depType === 'plugin') {
          dep.registryUrls!.unshift(SBT_PLUGINS_REPO, MAVEN_REPO);
        } else {
          dep.registryUrls!.unshift(MAVEN_REPO);
        }
      }
    }
  }
  return packages;
}