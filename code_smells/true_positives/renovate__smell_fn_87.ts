// @ts-nocheck
function _compare(version: string, other: string): number {
  const parsed1 = this._parse(version);
  const parsed2 = this._parse(other);
  if (!(parsed1 && parsed2)) {
    return 1;
  }
  const length = Math.max(parsed1.release.length, parsed2.release.length);
  for (let i = 0; i < length; i += 1) {
    const part1 = parsed1.release[i];
    const part2 = parsed2.release[i];
    if (part1 === undefined) {
      return 1;
    }
    if (part2 === undefined) {
      return -1;
    }
    if (part1 !== part2) {
      return part1 - part2;
    }
  }
  if (parsed1.prerelease !== parsed2.prerelease) {
    if (!parsed1.prerelease && parsed2.prerelease) {
      return 1;
    }
    if (parsed1.prerelease && !parsed2.prerelease) {
      return -1;
    }
    if (parsed1.prerelease && parsed2.prerelease) {
      return parsed1.prerelease.localeCompare(parsed2.prerelease);
    }
  }
  const suffix1 = coerceString(parsed1.suffix);
  const suffix2 = coerceString(parsed2.suffix);
  return suffix2.localeCompare(suffix1);
}