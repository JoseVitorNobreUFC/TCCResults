// @ts-nocheck
export function extractPackageFile(
  content: string,
  packageFile: string,
  config: ExtractConfig,
): PackageFileContent | null {
  logger.trace(`kustomize.extractPackageFile(${packageFile})`);
  const deps: PackageDependency[] = [];
  const pkg = parseKustomize(content, packageFile);
  if (!pkg) {
    return null;
  }
  for (const base of coerceArray(pkg.bases).filter(isString)) {
    const dep = extractResource(base);
    if (dep) {
      deps.push({
        ...dep,
        depType: pkg.kind,
      });
    }
  }
  for (const resource of coerceArray(pkg.resources).filter(isString)) {
    const dep = extractResource(resource);
    if (dep) {
      deps.push({
        ...dep,
        depType: pkg.kind,
      });
    }
  }
  for (const component of coerceArray(pkg.components).filter(isString)) {
    const dep = extractResource(component);
    if (dep) {
      deps.push({
        ...dep,
        depType: pkg.kind,
      });
    }
  }
  for (const image of coerceArray(pkg.images)) {
    const dep = extractImage(image, config.registryAliases);
    if (dep) {
      deps.push({
        ...dep,
        depType: pkg.kind,
      });
    }
  }
  for (const helmChart of coerceArray(pkg.helmCharts)) {
    const dep = extractHelmChart(helmChart, config.registryAliases);
    if (dep) {
      deps.push({
        ...dep,
        depType: 'HelmChart',
      });
    }
  }
  if (!deps.length) {
    return null;
  }
  return { deps };
}