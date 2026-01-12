// @ts-nocheck
export function extractPackageFile(
  content: string,
  packageFile: string,
  config: ExtractConfig,
): PackageFileContent | null {
  logger.trace(`vendir.extractPackageFile(${packageFile})`);
  const deps: PackageDependency[] = [];
  const pkg = parseVendir(content, packageFile);
  if (!pkg) {
    return null;
  }
  const contents = pkg.directories.flatMap((directory) => directory.contents);
  for (const content of contents) {
    if ('helmChart' in content && content.helmChart) {
      const dep = extractHelmChart(content.helmChart, config.registryAliases);
      if (dep) {
        deps.push(dep);
      }
    } else if ('git' in content && content.git) {
      const dep = extractGitSource(content.git);
      if (dep) {
        deps.push(dep);
      }
    } else if ('githubRelease' in content && content.githubRelease) {
      const dep = extractGithubReleaseSource(content.githubRelease);
      if (dep) {
        deps.push(dep);
      }
    }
  }
  if (!deps.length) {
    return null;
  }
  return { deps };
}