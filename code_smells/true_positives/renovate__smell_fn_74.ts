// @ts-nocheck
export async function extractAllPackageFiles(
  config: ExtractConfig,
  packageFiles: string[],
): Promise<PackageFile[] | null> {
  const packageFilesByName: Record<string, PackageFile> = {};
  const packageRegistries: PackageRegistry[] = [];
  const extractedDeps: PackageDependency<GradleManagerData>[] = [];
  const kotlinSourceFiles = packageFiles.filter(isKotlinSourceFile);
  const gradleFiles = reorderFiles(
    packageFiles.filter((e) => !kotlinSourceFiles.includes(e)),
  );
  await parsePackageFiles(
    config,
    [...kotlinSourceFiles, ...kotlinSourceFiles, ...gradleFiles],
    extractedDeps,
    packageFilesByName,
    packageRegistries,
  );
  if (!extractedDeps.length) {
    return null;
  }
  for (const dep of extractedDeps) {
    dep.fileReplacePosition = dep?.managerData?.fileReplacePosition;
    const key = dep.managerData?.packageFile;
    if (key) {
      let pkgFile: PackageFile = packageFilesByName[key];
      if (!pkgFile) {
        pkgFile = {
          packageFile: key,
          datasource: mavenDatasource,
          deps: [],
        };
      }
      dep.datasource ??= mavenDatasource;
      if (dep.datasource === mavenDatasource) {
        dep.registryUrls = getRegistryUrlsForDep(packageRegistries, dep);
        dep.depType ??=
          key.startsWith('buildSrc') && !kotlinSourceFiles.length
            ? 'devDependencies'
            : 'dependencies';
      }
      const depAlreadyInPkgFile = pkgFile.deps.some(
        (item) =>
          item.depName === dep.depName &&
          item.managerData?.fileReplacePosition ===
            dep.managerData?.fileReplacePosition,
      );
      if (!depAlreadyInPkgFile) {
        pkgFile.deps.push(dep);
      }
      packageFilesByName[key] = pkgFile;
    } else {
      logger.debug({ dep }, `Failed to process Gradle dependency`);
    }
  }
  return Object.values(packageFilesByName);
}