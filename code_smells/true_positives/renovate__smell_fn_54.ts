// @ts-nocheck
function getSatisfyingVersion(versions: string[], range: string): string | null {
  const r = parseRange(range);
  if (r) {
    let result: string | null = null;
    let vMax: NugetVersion | undefined;
    for (const version of versions) {
      const v = parseVersion(version);
      if (!v) {
        continue;
      }
      if (!matches(v, r)) {
        continue;
      }
      if (!vMax || compare(v, vMax) > 0) {
        vMax = v;
        result = version;
      }
    }
    return result;
  }
  const u = parseVersion(range);
  if (u) {
    let result: string | null = null;
    let vMax: NugetVersion | undefined;
    for (const version of versions) {
      const v = parseVersion(version);
      if (!v) {
        continue;
      }
      if (compare(v, u) < 0) {
        continue;
      }
      if (!vMax || compare(v, vMax) > 0) {
        vMax = v;
        result = version;
      }
    }
    return result;
  }
  return null;
}