// @ts-nocheck
export async function extractAllPackageFiles(
  config: ExtractConfig,
  packageFiles: string[],
): Promise<PackageFile[]> {
  const packages: PackageFile[] = [];
  const additionalRegistryUrls: string[] = [];
  for (const packageFile of packageFiles) {
    const content = await readLocalFile(packageFile, 'utf8');
    if (!content) {
      logger.debug({ packageFile }, 'packageFile has no content');
      continue;
    }
    if (packageFile.endsWith('settings.xml')) {
      const registries = extractRegistries(content);
      if (registries) {
        logger.debug(
          { registries, packageFile },
          'Found registryUrls in settings.xml',
        );
        additionalRegistryUrls.push(...registries);
      }
    } else if (packageFile.endsWith('.mvn/extensions.xml')) {
      const extensions = extractExtensions(content, packageFile);
      if (extensions) {
        packages.push(extensions);
      } else {
        logger.trace({ packageFile }, 'can not read extensions');
      }
    } else {
      const pkg = extractPackage(content, packageFile, config);
      if (pkg) {
        packages.push(pkg);
      } else {
        logger.trace({ packageFile }, 'can not read dependencies');
      }
    }
  }
  if (additionalRegistryUrls) {
    for (const pkgFile of packages) {
      for (const dep of pkgFile.deps) {
        if (dep.registryUrls) {
          dep.registryUrls.unshift(...additionalRegistryUrls);
        }
      }
    }
  }
  return cleanResult(resolveParents(packages));
}