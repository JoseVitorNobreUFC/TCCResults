// @ts-nocheck
export function extractPackageFile(content: string): PackageFileContent | null {
  const deps: PackageDependency[] = [];
  const tools: PackageDependency[] = [];
  let inExcludeBlock = false;
  const lines = content.split(newlineRegex);
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
    const line = lines[lineNumber];
    const dep = parseLine(line);
    if (inExcludeBlock) {
      if (endBlockRegex.test(line)) {
        inExcludeBlock = false;
      }
      continue;
    }
    if (!dep) {
      if (excludeBlockStartRegex.test(line)) {
        inExcludeBlock = true;
      }
      continue;
    }
    if (dep.depType === 'tool') {
      tools.push(dep);
      continue;
    }
    dep.managerData ??= {};
    dep.managerData.lineNumber = lineNumber;
    deps.push(dep);
  }
  for (const tool of tools) {
    const match = findMatchingModule(tool, deps);
    if (match?.depType === 'indirect') {
      delete match.enabled;
    }
  }
  if (!deps.length) {
    return null;
  }
  return { deps };
}