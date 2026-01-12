// @ts-nocheck
function extractFromSection(
  dependencies: PackageDependency<CargoManagerData>[] | undefined,
  cargoRegistries: CargoRegistries,
  target?: string,
): PackageDependency[] {
  if (!dependencies) {
    return [];
  }
  const deps: PackageDependency<CargoManagerData>[] = [];
  for (const dep of Object.values(dependencies)) {
    let registryUrls: string[] | undefined;
    if (dep.managerData?.registryName) {
      const registryUrl =
        getCargoIndexEnv(dep.managerData.registryName) ??
        cargoRegistries[dep.managerData?.registryName];
      if (registryUrl) {
        if (registryUrl !== DEFAULT_REGISTRY_URL) {
          registryUrls = [registryUrl];
        }
      } else {
        dep.skipReason = 'unknown-registry';
      }
    }
    if (registryUrls) {
      dep.registryUrls = registryUrls;
    } else {
      if (cargoRegistries[DEFAULT_REGISTRY_ID]) {
        if (cargoRegistries[DEFAULT_REGISTRY_ID] !== DEFAULT_REGISTRY_URL) {
          dep.registryUrls = [cargoRegistries[DEFAULT_REGISTRY_ID]];
        }
      } else {
        dep.skipReason = 'unknown-registry';
      }
    }
    if (target) {
      dep.target = target;
    }
    deps.push(dep);
  }
  return deps;
}