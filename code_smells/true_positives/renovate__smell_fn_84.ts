// @ts-nocheck
export async function extractPackageFile(
  content: string,
  packageFile: string,
): Promise<PackageFileContent | null> {
  logger.trace(`cocoapods.extractPackageFile(${packageFile})`);
  const deps: PackageDependency[] = [];
  const lines: string[] = content.split(newlineRegex);
  const registryUrls: string[] = [];
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
    const line = lines[lineNumber];
    const parsedLine = parseLine(line);
    const {
      depName,
      specName,
      currentValue,
      git,
      tag,
      path,
      source,
    }: ParsedLine = parsedLine;
    if (source) {
      registryUrls.push(source.replace(regEx(/\/*$/), ''));
    }
    if (depName) {
      const managerData = { lineNumber };
      let dep: PackageDependency = {
        depName,
        sharedVariableName: specName,
        skipReason: 'unspecified-version',
      };
      if (currentValue) {
        dep = {
          depName,
          sharedVariableName: specName,
          datasource: PodDatasource.id,
          currentValue,
          managerData,
          registryUrls,
        };
      } else if (git) {
        if (tag) {
          dep = { ...gitDep(parsedLine), managerData };
        } else {
          dep = {
            depName,
            sharedVariableName: specName,
            skipReason: 'git-dependency',
          };
        }
      } else if (path) {
        dep = {
          depName,
          sharedVariableName: specName,
          skipReason: 'path-dependency',
        };
      }
      deps.push(dep);
    }
  }
  const res: PackageFileContent = { deps };
  const lockFile = getSiblingFileName(packageFile, 'Podfile.lock');
  if (await localPathExists(lockFile)) {
    res.lockFiles = [lockFile];
  }
  return res;
}