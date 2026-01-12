// @ts-nocheck
transform((pyproject) => {
  const {
    project,
    tool,
    'build-system': poetryRequirement,
    'dependency-groups': dependencyGroups,
  } = pyproject;
  const deps: PackageDependency[] = [];
  const projectDependencies = project?.dependencies;
  if (projectDependencies) {
    deps.push(...projectDependencies);
  }
  const projectOptionalDependencies = project?.['optional-dependencies'];
  if (projectOptionalDependencies) {
    deps.push(...projectOptionalDependencies);
  }
  deps.push(...dependencyGroups);
  const poetryDependencies = tool?.poetry?.dependencies;
  if (poetryDependencies) {
    deps.push(...poetryDependencies);
  }
  const poetryDevDependencies = tool?.poetry?.['dev-dependencies'];
  if (poetryDevDependencies) {
    deps.push(...poetryDevDependencies);
  }
  const poetryGroupDependencies = tool?.poetry?.group;
  if (poetryGroupDependencies) {
    deps.push(...poetryGroupDependencies);
  }
  const packageFileVersion = tool?.poetry?.version;
  const packageFileContent: PackageFileContent = {
    deps,
    packageFileVersion,
  };
  const sourceUrls = tool?.poetry?.source;
  if (sourceUrls) {
    for (const dep of deps) {
      if (dep.managerData?.sourceName) {
        const sourceUrl = sourceUrls.find(
          ({ name }) => name === dep.managerData?.sourceName,
        );
        if (sourceUrl?.url) {
          dep.registryUrls = [sourceUrl.url];
        }
      }
    }
    const sourceUrlsFiltered = sourceUrls.filter(
      ({ priority }) => priority !== 'explicit',
    );
    if (sourceUrlsFiltered.length) {
      packageFileContent.registryUrls = uniq(
        sourceUrlsFiltered.map(({ url }) => url!),
      );
    }
  }
  return { packageFileContent, poetryRequirement };
})