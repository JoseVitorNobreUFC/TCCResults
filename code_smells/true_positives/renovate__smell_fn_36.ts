// @ts-nocheck
export function extractPackageFile(
  content: string,
  packageFile: string,
  config: ExtractConfig,
): PackageFileContent | null {
  const deps: PackageDependency[] = [];
  const descriptor = parseProjectToml(content, packageFile);
  if (!descriptor) {
    return null;
  }
  if (
    descriptor.io?.buildpacks?.builder &&
    isDockerRef(descriptor.io.buildpacks.builder)
  ) {
    const dep = getDockerDep(
      descriptor.io.buildpacks.builder.replace(DOCKER_PREFIX, ''),
      true,
      config.registryAliases,
    );
    logger.trace(
      {
        depName: dep.depName,
        currentValue: dep.currentValue,
        currentDigest: dep.currentDigest,
      },
      'Cloud Native Buildpacks builder',
    );
    deps.push({ ...dep, commitMessageTopic: 'builder {{depName}}' });
  }
  if (
    descriptor.io?.buildpacks?.group &&
    isArray(descriptor.io.buildpacks.group)
  ) {
    for (const group of descriptor.io.buildpacks.group) {
      if (isBuildpackByURI(group) && isDockerRef(group.uri)) {
        const dep = getDockerDep(
          group.uri.replace(DOCKER_PREFIX, ''),
          true,
          config.registryAliases,
        );
        logger.trace(
          {
            depName: dep.depName,
            currentValue: dep.currentValue,
            currentDigest: dep.currentDigest,
          },
          'Cloud Native Buildpack',
        );
        deps.push(dep);
      } else if (isBuildpackByURI(group) && isBuildpackRegistryRef(group.uri)) {
        const dep = getDep(group.uri.replace(BUILDPACK_REGISTRY_PREFIX, ''));
        if (dep) {
          deps.push(dep);
        }
      } else if (isBuildpackByName(group)) {
        const version = group.version;
        if (version) {
          const dep: PackageDependency = {
            datasource: BuildpacksRegistryDatasource.id,
            currentValue: version,
            packageName: group.id,
          };
          deps.push(dep);
        }
      }
    }
  } 
  if (!deps.length) {
    return null;
  }
  return { deps };
}