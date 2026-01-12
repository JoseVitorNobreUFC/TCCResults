// @ts-nocheck
export function getExtraDeps(
  goModBefore: string,
  goModAfter: string,
  excludeDeps: string[],
): ExtraDep[] {
  const result: ExtraDep[] = [];
  const diff = diffLines(goModBefore, goModAfter, {
    newlineIsToken: true,
  });
  const addDeps: Record<string, string> = {};
  const rmDeps: Record<string, string> = {};
  for (const { added, removed, value } of diff) {
    if (!added && !removed) {
      continue;
    }
    const res = parseLine(value);
    if (!res) {
      continue;
    }
    const { depName, depType, currentValue } = res;
    if (!depName || !currentValue) {
      continue;
    }
    let expandedDepName = depName;
    if (depType === 'toolchain') {
      expandedDepName = `${depName} (${depType})`;
    }
    if (added) {
      addDeps[expandedDepName] = currentValue;
    } else {
      rmDeps[expandedDepName] = currentValue;
    }
  }
  for (const [depName, currentValue] of Object.entries(rmDeps)) {
    if (excludeDeps.includes(depName)) {
      continue;
    }
    const newValue = addDeps[depName];
    if (newValue) {
      result.push({
        depName,
        currentValue,
        newValue,
      });
    }
  }
  return result;
}