// @ts-nocheck
export function extractCollections(lines: string[]): PackageDependency[] {
  const deps: PackageDependency[] = [];
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
    let lineMatch = newBlockRegEx.exec(lines[lineNumber]);
    if (lineMatch) {
      const dep: AnsibleGalaxyPackageDependency = {
        depType: 'galaxy-collection',
        managerData: {
          name: null,
          version: null,
          type: null,
          source: null,
        },
      };
      do {
        interpretLine(lineMatch, dep);
        const line = lines[lineNumber + 1];

        if (!line) {
          break;
        }
        lineMatch = blockLineRegEx.exec(line);
        if (lineMatch) {
          lineNumber += 1;
        }
      } while (lineMatch);
      if (finalize(dep)) {
        delete (dep as PackageDependency).managerData;
        deps.push(dep);
      }
    }
  }
  return deps;
}